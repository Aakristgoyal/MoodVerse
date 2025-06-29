const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const bookRoutes = require('./routes/bookRoutes');
const chatbotRoutes = require('./routes/chatbot');
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
app.use(bookRoutes);
app.use('/chatbot', chatbotRoutes);

// Test Route
app.get('/test', (req, res) => {
  res.send('Express server is working');
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
