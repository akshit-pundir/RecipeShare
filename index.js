require('dotenv').config();

const express=require("express");
const mongoose=require("mongoose");
const Reciepe=require("./models/reciepe");
const ejsMate=require("ejs-mate");
const ApiHelper=require("./public/javascript/api");
const path = require("path");
const methodOverride=require("method-override");
const Comment=require("./models/comment");
const PresentDate=require("./public/javascript/Date");
const CatchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const validateReciepe=require("./middlewares/validateReciepe");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");
const {isLoggedIn,storeReturnTo,VerifyAuthor }=require("./middlewares/authentication");




const app=express();

mongoose.connect('mongodb://127.0.0.1:27017/Reciepe');

const sessionOptions={
    secret:'blahblah',
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:Date.now() + (1000 * 60 * 60 * 24 ),
        maxAge:1000*60*60*24
    }
};

app.engine('ejs',ejsMate);
app.set('view engine','ejs')
app.set( 'views', path.join(__dirname,'views' ));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(session(sessionOptions))

app.use(flash())

// authentication

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy( User.authenticate() ))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// middleware for flash
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
});


// home page
app.get('/', (req,res)=>{
    res.render('home');
})



// display All Reciepe
app.get('/reciepe', CatchAsync(async(req,res,next) =>{
    
        const allReciepes=await ApiHelper.FetchReciepes();
        const  DBReciepes= await Reciepe.find({});
        // console.log(allReciepes);
        res.render('AllReciepe',{allReciepes,DBReciepes});
       

} ));

// render new reciepe form

app.get('/reciepe/new', isLoggedIn,(req,res)=>{

    res.render('new');
})




// post a new reciepe

app.post('/reciepe', isLoggedIn,validateReciepe,CatchAsync(async(req,res,next) =>{
   
    
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
        image:image,
        youtube:youtube
    });
    newReciepe.author=req.user._id;
    await newReciepe.save();

    req.flash('success',' Successfully Created the Recipe');
    
    res.redirect('/reciepe');
    
}));

// show a specific reciepe

app.get('/reciepe/:id',async(req,res,next)=>{

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
   
   
})


// render edit page

app.get('/reciepe/:id/edit', isLoggedIn,VerifyAuthor,CatchAsync(async(req,res,next)=>{

    const {id}=req.params;
    
    if(mongoose.isValidObjectId(id)){
        const DBReciepe=await Reciepe.findById(id);

     
        
        res.render('edit',{DBReciepe});
    }
    else{
        return next(new ExpressError("This Recipe Can't Be edited !!",500) );
    }
     
    
    }) );
    


// Edit a reciepe

app.put('/reciepe/:id', isLoggedIn, VerifyAuthor ,validateReciepe,CatchAsync(async(req,res)=>{

    const {id}=req.params;
    const ingredients=req.body.ingredients;
        
    let ingredientsArray = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(item => item.trim().toLowerCase()).filter(item => item.length > 0);
    const updatedReciepe=await Reciepe.findByIdAndUpdate(id,{...req.body,ingredients:ingredientsArray});
    await updatedReciepe.save();
    req.flash('success',' Successfully Updated the Recipe');
    res.redirect(`/reciepe/${id}`);

    
        
})  );


// delete a reciepe

app.delete('/reciepe/:id', isLoggedIn,VerifyAuthor,async(req,res)=>{

   const {id}=req.params;
   await Reciepe.findByIdAndDelete(id);
   req.flash('error','  Reciepe Deleted successfully ');
   res.redirect('/reciepe');


});


// post a Comment on a reciepe

app.post('/reciepe/:id',isLoggedIn,async(req,res)=>{
    
    const {id}=req.params;
    const {body,rating}=req.body;
    const reciepe= await Reciepe.findById(id);

    const {date,month,year}= PresentDate();
   
    const comment=new Comment({
        body:body,
        rating:5,
        date:date,
        year:year,
        month:month
    });
    const commentBy=req.user;
    comment.postedBy=commentBy.username;
    reciepe.comments.push(comment._id);
    await comment.save();
    await reciepe.save();
    
    req.flash('success',' New Comment Successfully Added');
    res.redirect(`/reciepe/${id}`);
})

// delete a review

app.delete('/reciepe/:id/:commentId', isLoggedIn,async(req, res) => {
    
        const { id, commentId } = req.params;
        
        await Reciepe.findByIdAndUpdate(id, { $pull: { comments: commentId } });
        await Comment.findByIdAndDelete(commentId);

        req.flash('error','  Comment Deleted successfully ');
        res.redirect(`/reciepe/${id}`);
});


// Register

app.get('/register',(req,res)=>{
    res.render('register');
})


app.post('/register', CatchAsync(async(req,res,next)=>{
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
     
 }));

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login', storeReturnTo , passport.authenticate('local',{failureFlash:true ,failureRedirect:'/login'})  ,(req,res)=>{
    
    req.flash('success',"Welcome Back!")
    const RedirectUrl=res.locals.returnTo || '/reciepe';
    res.redirect(RedirectUrl);
});


app.get('/logout',(req,res,next)=>{
    req.logOut(function(err){
        if(err){
            return next(err);
        }  
        req.flash('success',"succesfully logged out !");
        res.redirect('/reciepe');
    });
});

app.get('/about',(req,res)=>{
    res.render('about');
})



app.all("*",(req,res,next) =>{

     next( new ExpressError('Page Not Found',404));
});



app.use( (err,req,res,next) =>{

    const {message,status}=err;
    if(message!==""){
        res.status(status||500).render('error',{message,status });
    }
     
});



app.listen(3000,()=>{
    console.log("Website is live on Port 3000");
})







