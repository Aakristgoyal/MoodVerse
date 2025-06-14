const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const Book = require('./models/books');
const bookRoutes = require('./routes/bookRoutes');
const flash = require('connect-flash');

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

// Make flash messages available in all templates
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Configuration
app.use(session({
    secret: 'moodverse-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Pass session data to all views
app.use((req, res, next) => {
    res.locals.loggedIn = !!req.session.userId;
    res.locals.currentUser = req.session.user || null;
    next();
});

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/MoodVerse")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err));

// Test Route
app.get('/test', (req, res) => {
    res.send('Express server is working');
});

// Search Route (still separate from bookRoutes)
app.get("/search", async (req, res) => {
    const query = req.query.query;
    const books = await Book.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { author: { $regex: query, $options: "i" } },
            { moodTags: { $regex: query, $options: "i" } }
        ]
    });
    res.render("bookList", { books }); // Make sure bookList.ejs includes header/footer
});

// Book-related Routes
app.use(bookRoutes);

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
