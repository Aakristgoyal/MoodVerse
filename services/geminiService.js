const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateGeminiReply(query, books = [], history = []) {

    try {

        // Last few messages for context
        const previousConversation = history
            .slice(-6)
            .map(msg => {
                return `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text || ""}`;
            })
            .join("\n");

        // Recommended books from your engine
        const recommendedBooks =
            books.length > 0
                ? books.map((book, index) => (
                    `${index + 1}. ${book.title} by ${book.author || "Unknown"} (${book.source || "Unknown"})`
                )).join("\n")
                : "No books were found.";

        const prompt = `
You are MoodVerse AI.

MoodVerse is an AI-powered mood-based book recommendation platform.

Your job is ONLY to converse naturally.

The recommendation engine has ALREADY selected the books.

Rules:

1. NEVER invent book names.
2. NEVER recommend books outside the provided list.
3. Explain naturally why the books fit the user's request.
4. Be warm, conversational and encouraging.
5. Use emojis occasionally (not excessively).
6. Keep responses under 120 words.
7. If no books are provided, politely apologize and ask the user to try another mood or search.
8. If the user greets you, greet them.
9. If they ask about reading or books generally, answer naturally.
10. Do not mention recommendation engines, APIs or internal systems.

Conversation History:

${previousConversation}

Current User Query:

${query}

Books Selected:

${recommendedBooks}

Generate only the assistant's reply.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return response.text;

    } catch (error) {

        console.error(
            "Gemini Error:",
            error.message
        );

        return "⚠️ I'm having trouble generating a response right now, but here are some books you might enjoy.";

    }

}

module.exports = generateGeminiReply;