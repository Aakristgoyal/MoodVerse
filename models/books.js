const mongoose=require('mongoose')

const bookSchema=new mongoose.Schema({
    title:{type:String,required:true},
    desc:{type:String},
    author:{type:String,required:true},
    moodtags:{type:[String],required:true},
    uploadedBy:{type:String}
})

module.exports = mongoose.model("Book", bookSchema);
