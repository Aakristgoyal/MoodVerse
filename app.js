const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const port = 3000

// Middleware
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'moodverse-secret-key-2024', 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } 
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection
mongoose.connect("mongodb://localhost:27017/MoodVerse")
.then(() => {
    console.log("MongoDb connected")
}).catch((err) => {
    console.log(err)
})

app.get('/test', (req, res) => {
    res.send('Express server is working');
});

// Routes
const mainroutes = require('./routes/main')
app.use(mainroutes)

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})