const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Book = require('../models/books');
const Query=require('../models/query');
const moment = require('moment-timezone');
const multer=require('multer');
const path=require('path');
const { uploadImage, uploadPDF,uploadBookFiles } = require('../routes/upload');

const istDate = moment().tz("Asia/Kolkata").format();  // ISO format with IST time


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

// Inject login info globally for views
router.use((req, res, next) => {
    res.locals.loggedIn = !!req.session.userId;
    res.locals.user = req.session.user || null;
    next();
});

// Static Pages
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/about', (req, res) => {
  const messages = req.flash('success');
  res.render('about', { messages });
});


router.get('/contact', (req, res) => {
    res.render('contact');
});

// Auth Pages
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

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.error('Logout error:', err);
        res.redirect('/login');
    });
});

// Book Routes
router.get('/add-book', requireAuth, (req, res) => {
    res.render('addBook', {
        user: req.session.user,
        loggedIn: true
    });
});

router.post('/submit-query', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const existing = await Query.findOne({ email, message });

    if (existing) {
      req.flash('info', 'You have already submitted this message.');
    } else {
      const newQuery = new Query({ name, email, message });
      await newQuery.save();
      req.flash('success', 'Message delivered successfully!');
    }

    res.redirect('/about');
  } catch (err) {
    console.error('Error submitting query:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/about');
  }
});

router.post(
  '/add-book',
  requireAuth,uploadBookFiles.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]),
  async (req, res) => {
    try {
      const { title, desc, author, moodtags } = req.body;

      const coverImage = req.files?.coverImage?.[0];
      const pdfFile = req.files?.pdfFile?.[0];

      const newBook = new Book({
        title,
        desc,
        author,
        moodtags: moodtags.split(',').map(tag => tag.trim()),
        uploadedBy: req.session.userId,
        coverImage: coverImage ? `/uploads/images/${coverImage.filename}` : undefined,
        pdfPath: pdfFile ? `/uploads/pdfs/${pdfFile.filename}` : undefined
      });

      await newBook.save();
      res.redirect('/books');
    } catch (err) {
      console.error("Book upload failed:", err);
      res.status(500).send('Error uploading book.');
    }
  }
);

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        res.render('bookList', { books });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching books!');
    }
});

router.get('/my-books', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
}

  try {
    const books = await Book.find({ uploadedBy: req.session.user.id });

    res.render('myBooks', {
        title: 'My Books',
        books,
        loggedIn: true,
        user: req.session.user,
        isOwnerView: true,
        message: books.length === 0 ? 'No results found.' : null
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading your books.');
  }
});

// Route: GET /books/:id
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('uploadedBy');
        if (!book) {
            return res.status(404).send('Book not found');
        }

        // Determine if the current user is the owner of the book
        const showControls = req.session.userId && book.uploadedBy && book.uploadedBy._id.toString() === req.session.userId;

        res.render('bookDetail', {
            book,
            user: req.session.user,
            loggedIn: !!req.session.userId,
            showControls // ✅ Now defined
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/books/:id',
    uploadImage.single('coverImage'),
    requireAuth, async (req, res) => {
    try {
        const { title, author, desc, moodtags } = req.body;
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send('Book not found');

        if (book.uploadedBy.toString() !== req.session.user.id) {
            return res.status(403).send('Unauthorized');
        }

        book.title = title;
        book.author = author;
        book.desc = desc;
        book.moodtags = moodtags.split(',').map(tag => tag.trim());
        if (req.file) {
            book.coverImage = `/uploads/images/${req.file.filename}`;
        }
        await book.save();
        res.redirect(`/books/${book._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while updating book.');
    }
});
// DELETE /books/:id
router.delete('/books/:id', requireAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');

    if (book.uploadedBy.toString() !== req.session.user.id) {
      return res.status(403).send('Unauthorized');
    }

    await book.deleteOne();
    res.redirect('/my-books');
  } catch (err) {
    res.status(500).send('Error deleting the book.');
  }
});



// Route: GET /books/:id/edit
router.get('/books/:id/edit', requireAuth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        if (book.uploadedBy.toString() !== req.session.user.id) {
            return res.status(403).send('Unauthorized');
        }

        res.render('editBook', {
      title: 'Edit Book',
      book,
      error: null,     
      success: null,    
      loggedIn: req.session.userId,
      user: req.session.user
    });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading edit form');
    }
});


// Signup Logic
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

// Login Logic
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

module.exports = router;
