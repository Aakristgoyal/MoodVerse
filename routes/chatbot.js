const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET chatbot form
router.get("/", (req, res) => {
    const loggedIn = req.session && req.session.userId;

    // Initialize session chat history if not present
    if (!req.session.chatHistory) {
        req.session.chatHistory = [];
    }

    res.render("chatbot", {
        chatHistory: req.session.chatHistory,
        query: "", // Always clear query on fresh page load
        loggedIn,
        hideChatIcon: true // 👈 Hide chatbot icon on this page
    });
});

// POST chatbot recommend
router.post("/recommend", async (req, res) => {
    const userQuery = req.body.query;
    const loggedIn = req.session && req.session.userId;

    try {
        const response = await axios.post("http://localhost:5000/recommend", {
            query: userQuery
        });

        const responseData = response.data;

        // Initialize session chatHistory if not already
        if (!req.session.chatHistory) {
            req.session.chatHistory = [];
        }

        // Add user message
        req.session.chatHistory.push({ sender: "user", text: userQuery });

        // Add bot responses (text or book)
        responseData.forEach(item => {
            if (item.type === "message") {
                req.session.chatHistory.push({ sender: "bot", text: item.text });
            } else {
                req.session.chatHistory.push({ sender: "bot", book: item });
            }
        });

        // Render with updated chat history, clear input query
        res.render("chatbot", {
            chatHistory: req.session.chatHistory,
            query: "", // 👈 Clear query
            loggedIn,
            hideChatIcon: true // 👈 Still hide chatbot icon
        });

    } catch (error) {
        console.error("Error calling Flask service:", error.message);
        res.status(500).send("Failed to fetch recommendations.");
    }
});

// POST to clear chat
router.post("/clear", (req, res) => {
    if (req.session) {
        req.session.chatHistory = [];
    }
    res.redirect("/chatbot");
});

module.exports = router;