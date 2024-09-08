const express = require('express');
const router = express.Router();
const CatchAsync = require('../utilities/catchAsync');
const passport=require("passport");
const {storeReturnTo}=require("../middlewares/authentication");
const userControl=require("../controllers/UserControl");

// Register

router.get('/register',userControl.renderRegister)
    
    
router.post('/register', CatchAsync(userControl.registerUser));
    
    // login
    
 router.get('/login',userControl.renderlogin);
    
router.post('/login', storeReturnTo , passport.authenticate('local',{failureFlash:true ,failureRedirect:'/login'}) ,userControl.loginUser);
    
router.get('/logout',userControl.logout)

module.exports=router;