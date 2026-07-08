const express = require("express");
const router = express.Router();
const ReadingProgress = require("../models/readingProgress");
const { requireAuth } = require("../middleware/authMiddleware");

/* =========================
   SAVE / UPDATE PROGRESS
========================= */
router.post("/api/progress", requireAuth, async (req, res) => {
    try {
        const { bookId, currentPage, totalPages } = req.body;
        const progress = Math.round((currentPage / totalPages) * 100);
        const updated = await ReadingProgress.findOneAndUpdate(
            {
                user: req.session.userId,
                book: bookId
            },
            {
                currentPage,
                totalPages,
                progress
            },
            {
                upsert: true,
                new: true
            }
        );
        res.json({
            success: true,
            progress: updated
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to save progress"
        });
    }
}
);
/* =========================
   GET PROGRESS
========================= */
router.get("/api/progress/:bookId", requireAuth, async (req, res) => {
    try {
        const progress = await ReadingProgress.findOne({
                user: req.session.userId,
                book: req.params.bookId
            });
        res.json({
            success: true,
            progress
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch progress"
        });
    }
}
);
/* =========================
   CONTINUE READING
========================= */
router.get(
  "/api/continue-reading",
  requireAuth,
  async (req, res) => {

    try {

      const progress =
        await ReadingProgress
          .findOne({
            user: req.session.userId
          })
          .sort({
            updatedAt: -1
          })
          .populate("book");

      res.json({
        success: true,
        progress
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        message: "Failed to fetch continue reading data"
      });

    }

  }
);

router.get("/api/progress-check", (req, res) => {
  res.json({
    success: true,
    message: "Progress routes loaded"
  });
});

router.post("/api/progress-test", (req, res) => {
  res.json({
    success: true,
    message: "POST route works"
  });
});

module.exports = router;