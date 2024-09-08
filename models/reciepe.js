const mongoose=require("mongoose");
const User=require("./user");
const Comment=require("./comment");


const ReciepeSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true  
    },
    image:{
        url:String,
        filename:String,
        // required:true
        },
        
    prepTime:{
        type:Number,
        required:true
    },
    cookTime:{
        type:Number,
        required:true    
    },
    ingredients:{
        type:[String],
        default:[]
    },
    instruction:String,
    cusine:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },
    youtube:String,
    comments:[{
        type:mongoose.Types.ObjectId,
        ref:'Comment'
    }],

    author:{
        type:mongoose.Types.ObjectId,
        ref:User
    }



})

ReciepeSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Comment.deleteMany({
            _id:{
                $in:doc.comments
            }
        })
    }
})


module.exports=mongoose.model('Reciepe',ReciepeSchema);