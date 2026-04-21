// express server setup
const express= require('express');
const app = express();

// Load environment variables
require('dotenv').config();

// mongoose setup
const mongoose = require('mongoose');

// ejs setup
const path = require('path');
// ejs mate 
const ejsMate= require("ejs-mate");

// ejs setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// url encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, '/public')));
// ejs mate
app.engine("ejs",ejsMate);

// error class
const ExpressError =require("./utils/ExpressError.js");
// joi schemas
// _method
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//sessions
const session = require("express-session");
// flash
const flash = require("connect-flash");
const Student = require('./models/student');
const Company = require('./models/company');

// routes
const studentsRoutes = require("./routes/student.js");
const companyRoutes = require("./routes/company.js");

const passport = require('passport');
const LocalStrategy = require('passport-local');

async function main(){
    await mongoose.connect(process.env.MONGODB_URI);
}
main().catch(err=>console.log(err));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "supersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    // security purpose
    httpOnly:true,
  },
};
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success") || [];
  res.locals.error = req.flash("error") || [];
  next();
});

app.use(passport.initialize());
app.use(passport.session());


app.get("/",(req,res)=>{
    res.render("home.ejs");
})
passport.use('student-local', new LocalStrategy({ usernameField: 'email' }, Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

passport.use('company-local', new LocalStrategy({ usernameField: 'email' }, Company.authenticate()));
// students routes
app.use("/student",studentsRoutes);
// company routes
app.use("/company",companyRoutes);

app.all("/{*any}",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!")) ;
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; 
    const message = err.message || "Something went wrong!";
    res.status(statusCode).render("./error.ejs",{message});
});

const PORT = process.env.PORT || 3000; app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
