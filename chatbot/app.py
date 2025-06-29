from flask import Flask, request, jsonify
from recommender import (
    recommend_books_semantically,
    handle_basic_conversations,
    classify_intent
)

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def recommend():
    query = request.json.get("query", "").strip()
    if not query:
        return jsonify([])

    try:
        # Determine the intent of the user query
        intent = classify_intent(query)

        if intent == "smalltalk":
            response = handle_basic_conversations(query)
            return jsonify([response])

        elif intent == "recommendation":
            recommendations = recommend_books_semantically(query)
            return jsonify(recommendations)

        else:  # For "unknown" or other types of queries
            return jsonify([{
                "type": "message",
                "text": "🤔 I'm not sure how to respond to that. Try asking for a book recommendation or say 'help' to get started."
            }])

    except Exception as e:
        print("Recommendation error:", e)
        return jsonify([{
            "type": "message",
            "text": "⚠️ Sorry, something went wrong. Please try again later."
        }])

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
