const mongoose=require("mongoose");
const Reciepe=require("../models/reciepe");
const ApiHelper=require("../public/javascript/api");
const ExpressError = require('../utilities/ExpressError');
const {cloudinary}=require("../cloudinary/cloud");




module.exports.getAllReciepe=async(req,res,next) =>{
    
    const allReciepes=await ApiHelper.FetchReciepes();
    const  DBReciepes= await Reciepe.find({});
    // console.log(allReciepes);
    res.render('AllReciepe',{allReciepes,DBReciepes});
   

};

module.exports.getNewReciepe=(req,res)=>{
    res.render('new');

}


module.exports.createReciepe=async(req,res,next) =>{


    const {title,prepTime,cookTime ,ingredients,instruction,cusine,category,image,youtube}=req.body;
    let ingredientsArray = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(item => item.trim().toLowerCase()).filter(item => item.length > 0);
    
    const newReciepe= new Reciepe({
        title:title,
        prepTime:prepTime,
        cookTime:cookTime,
        ingredients:ingredientsArray,
        instruction:instruction,
        cusine:cusine,
        category:category,
        youtube:youtube
    });
    
    newReciepe.image={url:req.file.path,filename:req.file.filename};
    
    newReciepe.author=req.user._id;
    
    // console.log( req.file,newReciepe);
    
    await newReciepe.save();
    
    req.flash('success',' Successfully Created the Recipe');
    
    res.redirect('/reciepe');
    
};


 module.exports.showReciepe=async(req,res,next)=>{

    const dishId=req.params.id;
    let DBReciepe=null;
    const apiReciepe=await ApiHelper.getOnedDish(dishId);
    if( mongoose.isValidObjectId(dishId) ){
         DBReciepe=await Reciepe.findById(dishId).populate('comments').populate('author');
             }
    
        if(DBReciepe===null && apiReciepe===null){
            return next( new ExpressError('No Reciepe found with this Id',400)  );
        }
    
        res.render('show',{apiReciepe,DBReciepe});
    
    
};
    
    
 module.exports.getEditForm=async(req,res,next)=>{

    const {id}=req.params;
    
    if(mongoose.isValidObjectId(id)){
        const DBReciepe=await Reciepe.findById(id);
    
     
        
        res.render('edit',{DBReciepe});
    }
    else{
        return next(new ExpressError("This Recipe Can't Be edited !!",500) );
    }
     
};
    
  module.exports.EditReciepe=async(req,res)=>{

    const {id}=req.params;
    const ingredients=req.body.ingredients;
    const existingRecipe= await Reciepe.findById(id);
     
    if(req.file){
        const fileToDelete=existingRecipe.image.filename;
         await cloudinary.uploader.destroy(fileToDelete);
    }
    
    let ingredientsArray = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(item => item.trim().toLowerCase()).filter(item => item.length > 0);
    const updatedReciepe=await Reciepe.findByIdAndUpdate(id,
        {   ...req.body,
            ingredients:ingredientsArray,
            image: req.file ?  { url:req.file.path , filename:req.file.filename } :existingRecipe.image
        });
    await updatedReciepe.save();
    req.flash('success',' Successfully Updated the Recipe');
    res.redirect(`/reciepe/${id}`);
    
    
        
};
    
 module.exports.deleteReciepe=async(req,res)=>{

    const {id}=req.params;
    await Reciepe.findByIdAndDelete(id);
    req.flash('error','  Reciepe Deleted successfully ');
    res.redirect('/reciepe');
    
    
};   