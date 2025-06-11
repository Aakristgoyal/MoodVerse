const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String },
  author: { type: String, required: true },
  moodtags: { type: [String], required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model("Book", bookSchema);
