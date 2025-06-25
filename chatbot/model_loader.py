from sentence_transformers import SentenceTransformer
from pymongo import MongoClient

# Load and export the SentenceTransformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

# MongoDB setup and export
client = MongoClient("mongodb://localhost:27017/")
db = client["moodverse"]
collection = db["books"]
