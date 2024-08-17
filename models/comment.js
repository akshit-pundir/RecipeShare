const mongoose=require("mongoose");


const commentsSchema=new mongoose.Schema({

  body:String,
  rating:Number,
  date:Number,
  month:String,
  year:Number ,
  postedBy:String

});


module.exports=mongoose.model("Comment",commentsSchema)
