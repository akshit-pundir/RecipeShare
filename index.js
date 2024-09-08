 require('dotenv').config(); 
   
const express=require("express");
const mongoose=require("mongoose");
const Reciepe=require("./models/reciepe");
const ejsMate=require("ejs-mate");
const path = require("path");
const methodOverride=require("method-override");
const ExpressError = require('./utilities/ExpressError');
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const RecipeRoutes=require("./Routes/RecipeRoutes");
const commentRoutes=require("./Routes/commentRoutes");
const UserRoute=require("./Routes/UserRoutes");




const app=express();

const dbUrl=process.env.DbURL;
mongoose.connect(dbUrl);

const store= MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*60*60,
    crypto: {
        secret:"thisIsASecret"
    }
}) 

const sessionOptions={
    store,
    secret:'blahblah',
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
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
app.use(mongoSanitize())


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

app.use('/reciepe',RecipeRoutes);
app.use('/reciepe/:id',commentRoutes);
app.use('/',UserRoute);


// home page
app.get('/', (req,res)=>{
    res.render('home');
})


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








