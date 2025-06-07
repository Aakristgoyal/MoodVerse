const express=require('express')
const app=express()
const mongoose=require('mongoose')
const path=require('path')
const port=3000

app.use(express.urlencoded({ extended: true })); // middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); //to serve static files to app.js 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect("mongodb://localhost:27017/MoodVerse")
.then(()=>{
    console.log("MongoDb connected")
}).catch((err)=>{
    console.log(err)
})

app.get('/test', (req, res) => {
  res.send('Express server is working');
});

const mainroutes=require('./routes/main')
app.use(mainroutes)

app.listen(port,()=>{
    console.log(`server running on https://localhost:${port}`)
})
