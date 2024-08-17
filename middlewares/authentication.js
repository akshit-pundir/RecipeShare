const express=require("express");
const Reciepe=require("../models/reciepe");

const isLoggedIn=(req,res,next)=>{

      if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must be signed in');
        return res.redirect('/login');
      }  

      next();
}

const storeReturnTo=(req,res,next)=>{
   
  if(req.session.returnTo){
      res.locals.returnTo= req.session.returnTo; 
  }
    next();
}

const VerifyAuthor= async(req,res,next)=>{

   const {id}=req.params;
   const foundReciepe= await Reciepe.findById(id);
  if(!foundReciepe.author.equals(req.user._id)){
      req.flash('error',"You Don't have permission to do this ");
      return res.redirect(`/reciepe/${id}`);
  }
  next()
}

const VerifyComment= async(req,res,next)=>{

  const {commentId}=req.params;
  const foundComment= await Comment.findById(commentId);

  if(foundComment.postedBy !== req.user.username){
      req.flash('error',"you Don't have permission to delete this comment");
      return res.redirect(`/reciepe/${id}`);
  }
  next();
}




module.exports={ isLoggedIn ,storeReturnTo,VerifyAuthor  };
