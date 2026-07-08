const express = require("express");
const {requireAuth} = require("../middleware/authMiddleware");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
/* =========================
   GET CHAT HISTORY
========================= */
router.get("/api/chatbot/history", requireAuth, (req, res) => {
  if (
    !req.session.chatHistory
  ) {
    req.session.chatHistory = [];
  }
  res.json({
    success: true,
    chatHistory:
      req.session.chatHistory
  });
}
);
/* =========================
   CHATBOT RECOMMEND API
========================= */
router.post("/api/chatbot/recommend", requireAuth, async (req, res) => {
  const userQuery =
    req.body.query;
  try {
    const mlApiUrl =
      process.env.ML_API_URL;
    const response =
      await axios.post(
        `${mlApiUrl}/recommend`,
        {
          query: userQuery
        },
        {
          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );
    const responseData =
      response.data;
    /* Initialize History */
    if (
      !req.session.chatHistory
    ) {
      req.session.chatHistory = [];
    }
    /* Add User Message */
    req.session.chatHistory.push({
      sender: "user",
      text: userQuery
    });
    /* Process ML Response */
    if (
      Array.isArray(
        responseData
      )
    ) {
      responseData.forEach(
        item => {
          if (
            item.type ===
            "message"
          ) {
            req.session.chatHistory.push({
              sender: "bot",
              text:
                item.text
            });
          }
          else {
            req.session.chatHistory.push({
              sender: "bot",
              book: item
            });
          }
        }
      );
    }
    else {
      req.session.chatHistory.push({
        sender: "bot",
        text:
          "⚠️ Sorry, I didn't understand that."
      });
    }
    /* Return Updated Chat */
    res.json({
      success: true,
      chatHistory:
        req.session.chatHistory
    });
  } catch (error) {
    console.error(
      "Error calling ML API:",
      error.message,
      error.response?.data
    );
    if (
      !req.session.chatHistory
    ) {
      req.session.chatHistory = [];
    }
    req.session.chatHistory.push({
      sender: "bot",
      text:
        "⚠️ Failed to fetch recommendations. Please try again later."
    });
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
      chatHistory: req.session.chatHistory
    });
  }
}
);
/* =========================
   CLEAR CHAT HISTORY
========================= */
router.post("/api/chatbot/clear", requireAuth, (req, res) => {
  if (req.session) {
    req.session.chatHistory = [];
  }
  res.json({
    success: true,
    message: "Chat history cleared"
  });
}
);
module.exports = router;