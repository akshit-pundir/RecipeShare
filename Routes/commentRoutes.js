const express=require("express");
const router=express.Router({ mergeParams:true });
const {isLoggedIn}=require("../middlewares/authentication");
const ControlComment=require("../controllers/commentControl");








// post a Comment on a reciepe

router.post('/',isLoggedIn,ControlComment.submitComment)
    
    // delete a review
    
    router.delete('/:commentId', isLoggedIn,ControlComment.deleteComment);
    
    module.exports=router;