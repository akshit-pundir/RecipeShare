const mongoose=require("mongoose");
const PassportLocalMongoose=require("passport-local-mongoose");


const userSchema= new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true        
    },
    image:{
        url:String,
        filename:String        
    }

});

userSchema.plugin(PassportLocalMongoose)


module.exports=mongoose.model('User',userSchema);



