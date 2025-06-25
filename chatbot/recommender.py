from sentence_transformers import SentenceTransformer, util
from pymongo import MongoClient
import requests
import torch
import os
from dotenv import load_dotenv

load_dotenv()

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["moodverse"]
collection = db["books"]

NYT_API_KEY = os.environ.get("NYT_BOOKS_API_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_BOOKS_API_KEY")


def classify_intent(query):
    q = query.lower().strip()

    rec_keywords = ["book", "recommend", "suggest", "read", "story", "novel", "genre", "mood", "want something", "in the mood", "looking for"]
    chat_keywords = ["hi", "hello", "hey", "thank", "bye", "help", "how are you", "what can you do"]

    if any(kw in q for kw in rec_keywords):
        return "recommendation"
    elif any(kw in q for kw in chat_keywords):
        return "smalltalk"
    else:
        return "other"


def handle_basic_conversations(query):
    q = query.lower().strip()

    greetings = ["hi", "hello", "hey"]
    help_phrases = ["help", "what can you do", "how does this work", "who are you"]
    thanks = ["thank you", "thanks", "thx", "ty"]
    goodbye = ["bye", "goodbye", "see you"]

    if any(word in q for word in greetings):
        return {
            "type": "message",
            "text": "👋 Hello! I’m MoodVerse bot. Would you like me to suggest some books for you? Just tell me what kind of story you're in the mood for!"
        }
    elif any(word in q for word in help_phrases):
        return {
            "type": "message",
            "text": "🤖 I can recommend books based on your mood or theme. Try saying something like: 'I want something romantic' or 'Show me mystery books'."
        }
    elif any(word in q for word in thanks):
        return {
            "type": "message",
            "text": "🙏 You're welcome! Let me know whenever you want more book suggestions. 📚"
        }
    elif any(word in q for word in goodbye):
        return {
            "type": "message",
            "text": "👋 Goodbye! Feel free to come back anytime you need book vibes. Happy reading!"
        }

    return None


def get_mongo_books():
    books = list(collection.find({}, {
        "_id": 0, "title": 1, "author": 1,
        "moodtags": 1, "coverImage": 1, "pdfPath": 1
    }))
    valid_books = []
    for b in books:
        b["source"] = "MoodVerse"
        b["link"] = b.get("pdfPath", "#")
        b["coverImage"] = b.get("coverImage", "/uploads/images/default-cover.png")
        valid_books.append(b)
    return valid_books



def fetch_open_library_books(query):
    try:
        url = f"https://openlibrary.org/search.json?q={query}"
        res = requests.get(url).json()
        return [
            {
                "title": doc.get("title", "Untitled"),
                "description": "From Open Library",
                "coverImage": f"https://covers.openlibrary.org/b/id/{doc.get('cover_i', '')}-L.jpg"
                if doc.get("cover_i") else "/uploads/images/default-cover.png",
                "link": f"https://openlibrary.org{doc.get('key', '')}",
                "source": "Open Library"
            }
            for doc in res.get("docs", [])[:5]
        ]
    except Exception as e:
        print("Open Library error:", e)
        return []


def fetch_google_books(query):
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q={query}&key={GOOGLE_API_KEY}&maxResults=5"
        res = requests.get(url).json()
        return [
            {
                "title": item["volumeInfo"].get("title", "Unknown"),
                "description": item["volumeInfo"].get("description", "From Google Books"),
                "coverImage": item["volumeInfo"].get("imageLinks", {}).get("thumbnail", "/uploads/images/default-cover.png"),
                "link": item["volumeInfo"].get("infoLink", "#"),
                "source": "Google Books"
            }
            for item in res.get("items", [])[:5]
        ]
    except Exception as e:
        print("Google Books error:", e)
        return []


def fetch_nyt_books(query):
    try:
        url = f"https://api.nytimes.com/svc/books/v3/reviews.json?title={query}&api-key={NYT_API_KEY}"
        res = requests.get(url).json()
        if "results" in res:
            return [
                {
                    "title": r.get("book_title", "Unknown"),
                    "description": r.get("summary", "NYT Reviewed Book"),
                    "coverImage": "/uploads/images/default-cover.png",
                    "link": f"https://www.nytimes.com/search?query={r.get('book_title', '')}",
                    "source": "NYT Books"
                }
                for r in res.get("results", [])[:5]
            ]
        return []
    except Exception as e:
        print("NYT error:", e)
        return []


def recommend_books_semantically(query, top_k=15):
    mongo_books = get_mongo_books()
    openlib_books = fetch_open_library_books(query)
    google_books = fetch_google_books(query)
    nyt_books = fetch_nyt_books(query)

    final_books = []

    if mongo_books:
        mongo_desc = [b["description"] for b in mongo_books]
        mongo_emb = model.encode(mongo_desc, convert_to_tensor=True)
        query_emb = model.encode(query, convert_to_tensor=True)

        mongo_scores = util.pytorch_cos_sim(query_emb, mongo_emb)[0]
        top_mongo_indices = torch.topk(mongo_scores, k=min(5, len(mongo_books))).indices
        top_mongo_books = [mongo_books[i] for i in top_mongo_indices]
    else:
        print("No valid MongoDB descriptions found")
        top_mongo_books = []

    other_books = openlib_books + google_books + nyt_books
    all_candidates = top_mongo_books + other_books

    if not all_candidates:
        return []

    all_desc = [b.get("description", "") for b in all_candidates]
    all_emb = model.encode(all_desc, convert_to_tensor=True)
    query_emb = model.encode(query, convert_to_tensor=True)

    similarities = util.pytorch_cos_sim(query_emb, all_emb)[0]
    top_all_indices = torch.topk(similarities, k=min(top_k, len(all_candidates))).indices
    final_books = [all_candidates[i] for i in top_all_indices]
    return final_books