const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "assistant"],
    required: true
  },

  text: {
    type: String,
    default: ""
  },

  books: {
    type: [Object],
    default: []
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      default: "New Chat"
    },

    messages: [messageSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);