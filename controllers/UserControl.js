const User=require("../models/user");

module.exports.renderRegister=(req,res)=>{
    res.render('register');
    };
 
    
module.exports.registerUser=async(req,res,next)=>{
    try{
        const {email,username,password}=req.body;
        const NewUser= new User({email,username}); 
    
       
        const RegisterdUser=await User.register(NewUser,password);
        req.login(RegisterdUser,err =>{
            if(err) return next(err);
            
            req.flash('success',"Welcome Back!")
            res.redirect('/reciepe');
        });    
     
    }catch(e){
       req.flash('error',e.message);
       return res.redirect('/register');
     }   
     
    };
    
 module.exports.renderlogin=(req,res)=>{
    res.render('login');
    };

module.exports.loginUser=(req,res)=>{
    
    req.flash('success',"Welcome Back!")
    const RedirectUrl=res.locals.returnTo || '/reciepe';
    res.redirect(RedirectUrl);
};    

module.exports.logout=(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }  
        req.flash('success',"succesfully logged out !");
        res.redirect('/reciepe');
    });

};
    
    