const mongoose = require('mongoose');
const moment = require('moment-timezone');
const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: () => moment().tz("Asia/Kolkata").toDate()
  }
});


module.exports = mongoose.model('Query', querySchema);
