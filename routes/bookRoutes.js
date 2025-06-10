const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Book = require('../models/books');

// Middleware for session checking
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

const redirectIfLoggedIn = (req, res, next) => {
    if (req.session && req.session.userId) {
        return res.redirect('/');
    } else {
        return next();
    }
};

// Set global locals for views
router.use((req, res, next) => {
    res.locals.loggedIn = !!req.session.userId;
    res.locals.user = req.session.user || null;
    next();
});

// GET Routes

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/login', redirectIfLoggedIn, (req, res) => {
    res.render('login', {
        error: null,
        success: null,
        formData: {}
    });
});

router.get('/signup', redirectIfLoggedIn, (req, res) => {
    res.render('signup', {
        error: null,
        success: null,
        formData: {}
    });
});

router.get('/add-book', requireAuth, (req, res) => {
    res.render('addBook');
});

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        res.render('bookList', { books });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching books!');
    }
});

router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send('Book not found');
        res.render('bookDetail', { book });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to load book details');
    }
});

// POST Routes

router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        if (!name || !email || !password || !confirmPassword) {
            return res.render('signup', {
                error: 'Please fill in all fields',
                success: null,
                formData: { name, email }
            });
        }

        if (password !== confirmPassword) {
            return res.render('signup', {
                error: 'Passwords do not match',
                success: null,
                formData: { name, email }
            });
        }

        if (password.length < 6) {
            return res.render('signup', {
                error: 'Password must be at least 6 characters long',
                success: null,
                formData: { name, email }
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.render('signup', {
                error: 'An account with this email already exists',
                success: null,
                formData: { name, email }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        await newUser.save();

        req.session.userId = newUser._id;
        req.session.user = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        };

        res.redirect('/books');
    } catch (error) {
        console.error('Signup error:', error);
        res.render('signup', {
            error: 'Something went wrong. Please try again.',
            success: null,
            formData: { name, email }
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password, remember } = req.body;

    try {
        if (!email || !password) {
            return res.render('login', {
                error: 'Please fill in all fields',
                success: null,
                formData: { email }
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.render('login', {
                error: 'Invalid email or password',
                success: null,
                formData: { email }
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.render('login', {
                error: 'Invalid email or password',
                success: null,
                formData: { email }
            });
        }

        req.session.userId = user._id;
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        if (remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        }

        res.redirect('/books');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            error: 'Something went wrong. Please try again.',
            success: null,
            formData: { email }
        });
    }
});

router.post('/add-book', requireAuth, async (req, res) => {
    const { title, author, desc, moodtags } = req.body;
    const tagsArray = moodtags.split(',').map(tag => tag.trim());

    try {
        const newBook = new Book({
            title,
            author,
            desc,
            moodtags: tagsArray,
            uploadedBy: req.session.user.name || 'Anonymous'
        });

        await newBook.save();
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to save book');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
