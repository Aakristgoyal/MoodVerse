const mongoose = require("mongoose");

const readingProgressSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },

  currentPage: {
    type: Number,
    default: 1
  },

  totalPages: {
    type: Number,
    default: 0
  },

  progress: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

module.exports =mongoose.model("ReadingProgress",readingProgressSchema);