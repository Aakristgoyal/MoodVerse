const express = require('express')
const router = express.Router()
const Book = require('../models/books')
const session = require('express-session');

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

router.get('/add-book', (req, res) => {
  res.render('addBook');
});

router.get('/books',async(req,res)=>{
  try{
    const books=await Book.find({});
    res.render('bookList',{books})
  }
  catch(err){
    console.error(err);
    res.status(500).send('Error fetching Books!')
  }
});

router.get('/books/:id',async(req,res)=>{
  try{
    const book=await Book.findById(req.params.id);
    res.render('bookDetail',{book});
  }
  catch(err){
    console.error(err);
    res.status(500).send('Book not Found')
  }
});

router.get('/about', (req, res) => {
  res.render('about'); 
});

router.get('/contact', (req, res) => {
  res.render('contact'); 
});

router.get('/login', (req, res) => {
  res.render('login', {
    error: null,
    success: null,
    formData: {}
  });
});

router.get('/signup', (req, res) => {
  res.render('signup', {
    error: null,
    success: null,
    formData: {}
  });
});


router.post('/add-book', async (req, res) => {
  const { title, author, desc, moodtags, uploadedBy } = req.body;
  const tagsArray = moodtags.split(",").map(tag => tag.trim());
  try {
    const newBook = new Book({
      title,
      author,
      desc,
      moodtags:tagsArray,
      uploadedBy
    });
    await newBook.save();
    res.send('Book submitted successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save book')
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

        // Set session
        req.session.userId = user._id;
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        if (remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        }

        res.redirect('/books'); // Redirect to your existing books page

    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            error: 'Something went wrong. Please try again.',
            success: null,
            formData: { email }
        });
    }
});

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

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

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

        res.redirect('/books'); // Redirect to your existing books page

    } catch (error) {
        console.error('Signup error:', error);
        res.render('signup', {
            error: 'Something went wrong. Please try again.',
            success: null,
            formData: { name, email }
        });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/login');
    });
});

module.exports = router;