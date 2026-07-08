const express = require("express");
const router = express.Router();
const SavedBook = require("../models/savedBook");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/api/saved-books", requireAuth, async (req, res) => {
  try {
    const books = await SavedBook.find({ user: req.session.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, books });
  } catch (err) {
    console.error("Error fetching saved books:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch saved books" });
  }
});

router.post("/api/saved-books", requireAuth, async (req, res) => {
  try {
    const { bookId, source, title, author, coverImage, link } = req.body;

    const existing = await SavedBook.findOne({
      user: req.session.userId,
      bookId
    });

    if (existing) {
      return res.json({ success: true, message: "Already saved" });
    }

    const saved = await SavedBook.create({
      user: req.session.userId,
      bookId,
      source,
      title,
      author,
      coverImage,
      link, // ✅ save the link too
    });

    res.json({ success: true, saved });
  } catch (err) {
    // ✅ surface validation errors clearly
    if (err.name === "ValidationError") {
      console.error("SavedBook validation error:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error("Error saving book:", err.message);
    res.status(500).json({ success: false, message: "Failed to save book" });
  }
});

router.delete("/api/saved-books/:bookId", requireAuth, async (req, res) => {
  try {
    await SavedBook.deleteOne({
      user: req.session.userId,
      bookId: decodeURIComponent(req.params.bookId)
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting saved book:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete book" });
  }
});

module.exports = router;