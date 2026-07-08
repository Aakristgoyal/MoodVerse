require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require("./routes/searchRoutes");
const queryRoutes = require("./routes/queryRoutes");
const bookRoutes = require('./routes/bookRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const progressRoutes = require("./routes/progressRoutes");
const savedBookRoutes = require("./routes/savedBookRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const personalizedRoutes = require("./routes/personalizedRoutes");
const MongoStore = require('connect-mongo');
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ Session Configuration (single and correct one)
app.use(session({
  secret: 'moodverse-secret-key-2024',
  resave: false,
  saveUninitialized: false, // better security practice
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // your MongoDB connection string
    ttl: 14 * 24 * 60 * 60 // sessions expire in 14 days
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days in ms
  }
}));

// Flash Messages
app.use(flash());

// Global Template Variables
app.use((req, res, next) => {
  res.locals.loggedIn = !!req.session.userId;
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.hideChatIcon = false;
  next();
});

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use(searchRoutes);
app.use(queryRoutes);
app.use("/api/auth", authRoutes);
app.use(bookRoutes);
app.use('/chatbot', chatbotRoutes);
app.use(progressRoutes);
app.use(savedBookRoutes);
app.use("/api/conversations",conversationRoutes);
app.use("/api/personalized", personalizedRoutes);
// Test Route
app.get('/test', (req, res) => {
  res.send('Express server is working');
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
