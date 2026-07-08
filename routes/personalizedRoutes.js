const express = require("express");
const router = express.Router();
const axios = require("axios");

const SavedBook = require("../models/savedBook");
const Conversation = require("../models/conversation");
const ReadingProgress = require("../models/readingProgress");
const Book = require("../models/books");

const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", requireAuth, async (req, res) => {

    try {

        const userId = req.session.userId;

        // --------------------------------------------------
        // Fetch Saved Books
        // --------------------------------------------------

        const savedBooks = await SavedBook.find(
            { user: userId },
            {
                _id: 0,
                title: 1,
                author: 1
            }
        );

        // --------------------------------------------------
        // Fetch Recent AI Conversations
        // --------------------------------------------------

        const conversations = await Conversation.find(
            {
                user: userId
            },
            {
                _id: 0,
                messages: 1
            }
        )
        .sort({ updatedAt: -1 })
        .limit(10);

        // --------------------------------------------------
        // Continue Reading
        // --------------------------------------------------

        const continueReading = await ReadingProgress
            .findOne({
                user: userId
            })
            .populate("book");

        // --------------------------------------------------
        // User Uploaded Books
        // --------------------------------------------------
        const uploadedBooks = await Book.find(
            {
                uploadedBy: userId
            },
            {
                _id: 0,
                title: 1,
                author: 1
            }
        );

        // --------------------------------------------------
        // Call Python Recommendation Engine
        // --------------------------------------------------
        const response = await axios.post(
            `${process.env.ML_API_URL}/recommend/personalized`,
            {
                savedBooks,
                recentChats: conversations,
                continueReading,
                uploadedBooks
            }
        );
        res.json(response.data);
    }
    catch (err) {
        console.error(
            "Personalization Error:",
            err.message
        );
        res.status(500).json({
            success: false,
            sections: {}
        });
    }
});

module.exports = router;