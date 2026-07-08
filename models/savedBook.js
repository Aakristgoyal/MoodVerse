const mongoose = require("mongoose");

const savedBookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    bookId: {
        type: String,
        required: true
    },

    source: {
        type: String,
        enum: ["mongodb", "openlibrary", "google", "nyt","nytbooks"],
        required: true
    },
    title: String,
    author: String,
    coverImage: String,
    link: String,
}, {
    timestamps: true
});

module.exports = mongoose.model("SavedBook", savedBookSchema);