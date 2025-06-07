const express=require('express')
const router=express.Router()

router.get('/add-book', (req, res) => {
  res.render('addBook');
});

router.post('/add-book', (req, res) => {
  console.log('Form data received:', req.body);
  res.send('Book submitted successfully!');
});

module.exports=router;