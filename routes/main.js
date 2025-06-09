const express = require('express')
const router = express.Router()
const Book = require('../models/books')

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

module.exports = router;