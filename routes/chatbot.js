const express = require("express");
const axios = require("axios");
const router = express.Router();
require('dotenv').config();
// GET chatbot form
router.get("/", (req, res) => {
    const loggedIn = req.session && req.session.userId;

    if (!req.session.chatHistory) {
        req.session.chatHistory = [];
    }

    res.render("chatbot", {
        chatHistory: req.session.chatHistory,
        query: "",
        loggedIn,
        hideChatIcon: true
    });
});

// POST chatbot recommend
router.post("/recommend", async (req, res) => {
    const userQuery = req.body.query;
    const loggedIn = req.session && req.session.userId;

    try {
        const mlApiUrl = process.env.ML_API_URL;

        const response = await axios.post(mlApiUrl, {
            query: userQuery
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const responseData = response.data;

        if (!req.session.chatHistory) {
            req.session.chatHistory = [];
        }

        req.session.chatHistory.push({ sender: "user", text: userQuery });

        if (Array.isArray(responseData)) {
            responseData.forEach(item => {
                if (item.type === "message") {
                    req.session.chatHistory.push({ sender: "bot", text: item.text });
                } else {
                    req.session.chatHistory.push({ sender: "bot", book: item });
                }
            });
        } else {
            console.error("Unexpected ML API response:", responseData);
            req.session.chatHistory.push({ sender: "bot", text: "⚠️ Sorry, I didn't understand that." });
        }

        res.render("chatbot", {
            chatHistory: req.session.chatHistory,
            query: "",
            loggedIn,
            hideChatIcon: true
        });

    } catch (error) {
        console.error("Error calling Flask service:", error.message, error.response?.data);
        req.session.chatHistory.push({ sender: "bot", text: "⚠️ Failed to fetch recommendations. Please try again later." });
        res.render("chatbot", {
            chatHistory: req.session.chatHistory,
            query: "",
            loggedIn,
            hideChatIcon: true
        });
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
