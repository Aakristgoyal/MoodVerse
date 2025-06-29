const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Book = require('../models/books');
const Query=require('../models/query');
const moment = require('moment-timezone');
const path=require('path');
const Busboy = require('busboy');
require('dotenv').config();
const cloudinary = require('../routes/cloudinaryConfig');
const axios=require('axios')
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
router.get('/', async (req, res) => {
  try {
    // Fetch Open Library featured books (e.g., popular titles or a fixed query)
    const apiRes = await axios.get('https://openlibrary.org/search.json?q=harry+potter&limit=8');

    const featuredBooks = apiRes.data.docs.map(book => ({
      title: book.title,
      author: book.author_name?.[0] || 'Unknown',
      coverImage: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : '/uploads/images/default-cover.png',
      openLibraryLink: `https://openlibrary.org${book.key}`
    }));

    res.render('home', {
      featuredBooks
    });

  } catch (err) {
    console.error('Error fetching featured books:', err);
    res.render('home', { featuredBooks: [] });
  }
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

router.get('/search', async (req, res) => {
  console.log("Search term received:", req.query.query); 

  let query = req.query.query || '';

  if (typeof query !== 'string' || query.trim() === '') {
    return res.render('searchResults', {
      localBooks: [],
      apiBooks: [],
      googleBooks: [],
      nytBooks: [],
      searchTerm: '',
      message: 'Please enter a valid search term.'
    });
  }

  query = query.trim();

  try {
    // 1. Local books from MongoDB
    const localBooks = await Book.find({
      title: { $regex: query, $options: 'i' }
    });

    // 2. Open Library API (no key needed)
    const apiRes = await axios.get(`${process.env.OPEN_LIBRARY_BASE}/search.json?q=${encodeURIComponent(query)}&limit=10`);
    const apiBooks = apiRes.data.docs.map(book => ({
      title: book.title,
      author: book.author_name?.[0] || 'Unknown',
      coverImage: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : '/uploads/images/default-cover.png',
      source: 'openlibrary'
    }));

    // 3. Google Books API
    const googleRes = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${process.env.GOOGLE_BOOKS_API_KEY}`);
    const googleBooks = (googleRes.data.items || []).map(item => ({
      title: item.volumeInfo.title,
      author: (item.volumeInfo.authors || ['Unknown'])[0],
      coverImage: item.volumeInfo.imageLinks?.thumbnail || '/uploads/images/default-cover.png',
      link: item.volumeInfo.infoLink,
      source: 'googlebooks'
    }));
    // 4. NYT Books API — Flexible Title Search
    let nytBooks = [];
    try {
      const nytRes = await axios.get(
        `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?title=${encodeURIComponent(query)}&api-key=${process.env.NYT_BOOKS_API_KEY}`
      );

      nytBooks = (nytRes.data.results || []).map(book => ({
        title: book.title,
        author: book.author || 'Unknown',
        coverImage: '/uploads/images/default-cover.png',
        link: `https://www.nytimes.com/search?query=${encodeURIComponent(book.title)}`,
        source: 'nytbooks'
      }));
    } catch (nytErr) {
      console.warn('NYT API fallback triggered:', nytErr.response?.data?.errors || nytErr.message);
      nytBooks = []; // You can optionally retry with another NYT endpoint here
    }

    // Render all sources together
    res.render('searchResults', {
      localBooks,
      apiBooks,
      googleBooks,
      nytBooks,
      searchTerm: query
    });

  } catch (err) {
    console.error('Search error:', err.response?.data || err.message || err);
    res.status(500).send('Search failed');
  }
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

router.post('/add-book', requireAuth, async (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  let coverImageUrl = '';
  let pdfFileUrl = '';
  const fields = {};

  const uploads = [];
  console.log('PDF URL:', pdfFileUrl);

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(`Uploading file: ${filename}, field: ${fieldname}`);

    const uploadPromise = new Promise((resolve, reject) => {
      let cloudinaryStream;

      if (fieldname === 'coverImage') {
        cloudinaryStream = cloudinary.uploader.upload_stream(
          { folder: 'moodverse/images', resource_type: 'image' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary image upload error:', error);
              reject(error);
            } else {
              console.log('Image uploaded:', result.secure_url);
              coverImageUrl = result.secure_url;
              resolve();
            }
          }
        );
      } else if (fieldname === 'pdfFile') {
        cloudinaryStream = cloudinary.uploader.upload_stream(
          { folder: 'moodverse/pdfs', resource_type: 'auto',format:'pdf' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary PDF upload error:', error);
              reject(error);
            } else {
              console.log('PDF uploaded:', result.secure_url);
              pdfFileUrl = result.secure_url;
              resolve();
            }
          }
        );
      } else {
        // Ignore unexpected fields
        file.resume();
        return resolve();
      }

      file.pipe(cloudinaryStream);
    });

    uploads.push(uploadPromise);
  });

  busboy.on('field', (fieldname, val) => {
    fields[fieldname] = val;
  });

  busboy.on('finish', async () => {
    try {
      await Promise.all(uploads);

      // ✅ Save book to MongoDB
      const newBook = new Book({
        title: fields.title,
        author: fields.author,
        desc: fields.desc,
        moodtags: fields.moodtags.split(',').map(tag => tag.trim()),
        uploadedBy: req.session.userId,
        coverImage: coverImageUrl,
        pdfFile: pdfFileUrl,
      });

      await newBook.save();

      req.flash('success', 'Book added successfully with image and PDF!');
      res.redirect('/books');
    } catch (err) {
      console.error('Error adding book:', err);
      req.flash('error', 'Failed to add book');
      res.redirect('/add-book');
    }
  });

  req.pipe(busboy);
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

router.put('/books/:id', requireAuth, async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  const updates = {};
  const uploads = [];

  let book;

  try {
    book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    if (book.uploadedBy.toString() !== req.session.userId) {
      return res.status(403).send('Unauthorized');
    }
  } catch (err) {
    console.error('Error finding book:', err);
    return res.status(500).send('Server error');
  }

  busboy.on('field', (fieldname, val) => {
    if (fieldname === 'moodtags') {
      updates.moodtags = val.split(',').map(tag => tag.trim());
    } else {
      updates[fieldname] = val;
    }
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(`Uploading file: ${filename}, field: ${fieldname}`);

    const uploadPromise = new Promise((resolve, reject) => {
      let cloudinaryStream;

      if (fieldname === 'coverImage') {
        cloudinaryStream = cloudinary.uploader.upload_stream(
          { folder: 'moodverse/images', resource_type: 'image' },
          (error, result) => {
            if (error) {
              console.error('Image upload error:', error);
              reject(error);
            } else {
              updates.coverImage = result.secure_url;
              console.log('Cover image updated:', result.secure_url);
              resolve();
            }
          }
        );
      } else if (fieldname === 'pdfFile') {
        cloudinaryStream = cloudinary.uploader.upload_stream(
          { folder: 'moodverse/pdfs', resource_type: 'auto' , format:'pdf'},
          (error, result) => {
            if (error) {
              console.error('PDF upload error:', error);
              reject(error);
            } else {
              updates.pdfFile = result.secure_url;
              console.log('PDF updated:', result.secure_url);
              resolve();
            }
          }
        );
      } else {
        // Skip unexpected fields
        file.resume();
        return resolve();
      }

      file.pipe(cloudinaryStream);
    });

    uploads.push(uploadPromise);
  });

  busboy.on('finish', async () => {
    try {
      await Promise.all(uploads);

      // ✅ Update book with new data
      Object.assign(book, updates);
      await book.save();

      req.flash('success', 'Book updated successfully!');
      res.redirect(`/books/${book._id}`);
    } catch (err) {
      console.error('Error updating book:', err);
      req.flash('error', 'Failed to update book');
      res.redirect(`/books/${book._id}/edit`);
    }
  });

  req.pipe(busboy);
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
