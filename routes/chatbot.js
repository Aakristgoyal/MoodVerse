const express = require("express");
const axios = require("axios");
const router = express.Router();
require('dotenv').config();

// ✅ GET chatbot form route
router.get("/", (req, res) => {
  const loggedIn = req.session && req.session.userId;

  // Initialize chat history if not present
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

// ✅ POST chatbot recommend route
router.post("/recommend", async (req, res) => {
  const userQuery = req.body.query;
  const loggedIn = req.session && req.session.userId;

  try {
    const mlApiUrl = process.env.ML_API_URL;

    const response = await axios.post(`${mlApiUrl}/recommend`, {
      query: userQuery
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const responseData = response.data;

    // Initialize chat history if not present
    if (!req.session.chatHistory) {
      req.session.chatHistory = [];
    }

    // Add user query to chat history
    req.session.chatHistory.push({ sender: "user", text: userQuery });

    // ✅ Handle ML API response (array of books or messages)
    if (Array.isArray(responseData)) {
      responseData.forEach(item => {
        if (item.type === "message") {
          // For plain text messages
          req.session.chatHistory.push({ sender: "bot", text: item.text });
        } else {
          // For book recommendations
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
    console.error("Error calling ML API:", error.message, error.response?.data);
    req.session.chatHistory.push({ sender: "bot", text: "⚠️ Failed to fetch recommendations. Please try again later." });

    res.render("chatbot", {
      chatHistory: req.session.chatHistory,
      query: "",
      loggedIn,
      hideChatIcon: true
    });
  }
});

// ✅ POST to clear chat history
router.post("/clear", (req, res) => {
  if (req.session) {
    req.session.chatHistory = [];
  }
  res.redirect("/chatbot");
});

module.exports = router;
