const express=require("express");
const router=express.Router();
const {isLoggedIn,VerifyAuthor }=require("../middlewares/authentication");
const CatchAsync = require('../utilities/catchAsync');
const validateReciepe=require("../middlewares/validateReciepe");
const multer  = require('multer');
const {storage}=require("../cloudinary/cloud");
const upload=multer( { storage } );
const ReciepeControl=require("../controllers/ReciepeControl");




// display All Reciepe
router.get('/', CatchAsync(ReciepeControl.getAllReciepe));

// render new reciepe form

router.get('/new', isLoggedIn, ReciepeControl.getNewReciepe);




// post a new reciepe

router.post('/', isLoggedIn, upload.single('image') ,validateReciepe,CatchAsync(ReciepeControl.createReciepe));

// show a specific reciepe

router.get('/:id',ReciepeControl.showReciepe)


// render edit page

router.get('/:id/edit', isLoggedIn,VerifyAuthor,CatchAsync(ReciepeControl.getEditForm) );



// Edit a reciepe

router.put('/:id', isLoggedIn, VerifyAuthor ,upload.single('image') ,validateReciepe,CatchAsync(ReciepeControl.EditReciepe)  );


// delete a reciepe

router.delete('/:id', isLoggedIn,VerifyAuthor,ReciepeControl.deleteReciepe);



module.exports=router;