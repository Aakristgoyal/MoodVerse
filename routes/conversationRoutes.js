const express = require("express");
const router = express.Router();
const axios = require("axios");
const Conversation = require("../models/conversation");
const { requireAuth } = require("../middleware/authMiddleware");
const generateGeminiReply = require("../services/geminiService");

router.post("/new", requireAuth, async (req, res) => {
  try {
    const conversation = await Conversation.create({
      user: req.session.userId,
      title: "New Chat",
      messages: []
    });

    res.json(conversation);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create chat"
    });
  }
}
);

router.get("/", requireAuth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      user: req.session.userId
    })
      .sort({
        updatedAt: -1
      });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({
      message: "Failed to load chats"
    });
  }
}
);

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.session.userId
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Chat not found"
      });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({
      message: "Failed to load chat"
    });
  }
}
);

router.post("/:id/chat", requireAuth, async (req, res) => {
  try {
    const { query } = req.body;
    const conversation = await Conversation.findOne({
        _id: req.params.id,
        user: req.session.userId
      });

    if (!conversation) {
      return res.status(404).json({
        message: "Chat not found"
      });
    }

    // Save user message
    conversation.messages.push({
      sender: "user",
      text: query
    });

    // First message becomes title
    if (conversation.title === "New Chat") {
      conversation.title = query.slice(0, 40);
    }

    // Get recommendations from Flask
    const flaskResponse = await axios.post(
        `${process.env.ML_API_URL}/recommend`,
        {
          query
        }
      );

    const books = Array.isArray(flaskResponse.data)
        ? flaskResponse.data
        : [];

    // Generate Gemini response
    const geminiReply = await generateGeminiReply(
        query,
        books,
        conversation.messages
      );
    // Save Gemini response
    conversation.messages.push({
      sender: "assistant",
      text: geminiReply
    });
    // Save books
    if (books.length > 0) {
      conversation.messages.push({
        sender: "assistant",
        books
      });
    }
    await conversation.save();
    res.json(conversation);
  }

  catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to process chat"
    });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Conversation.deleteOne({
      _id: req.params.id,
      user: req.session.userId
    });

    res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete"
    });
  }
}
);

module.exports = router;