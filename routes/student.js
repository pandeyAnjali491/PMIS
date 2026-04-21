// express router setup
const express = require('express');
const router = express.Router({mergeParams: true});

// models
const Student = require('../models/student');
const Company = require('../models/company');
const Internship = require("../models/internship");

// wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");

// error class
const ExpressError = require("../utils/ExpressError.js");

// joi schemas
const { studentSchema } = require('../schema.js');

// passport
const passport = require('passport');

// Middleware to check if student is authenticated
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in first!');
    return res.redirect('/student/login');
  }
  next();
};

// Joi validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      let errMessage = error.details.map((ele) => ele.message).join(",");
      throw new ExpressError(400, errMessage);
    } else {
      next();
    }
  };
};

router.post("/", validate(studentSchema), wrapAsync(async (req, res) => {
  try {
    const data = req.body.data;
    const { password } = data;
    delete data.password; // Remove password from data object

    const student = new Student(data);
    const registeredStudent = await Student.register(student, password);

    req.flash('success', 'Registered successfully! Please login.');
    res.redirect('/student/login');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/student/signup');
  }
}));


// put request update profile
router.put("/:id",async(req,res)=>{
    let id=req.params.id;
    const data = req.body.data;
    await Student.findByIdAndUpdate(id,data);
    req.flash("success","updated successfully");
    res.redirect("/student/profile");
})

router.get("/login",(req,res)=>{
    res.render("student/login.ejs");
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/student/login');
    }

    const result = await student.authenticate(password);

    if (!result || result.error) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/student/login');
    }

    // Set user session
    req.login(result.user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome back!');
      res.redirect('/student/dashboard');
    });
  } catch (err) {
    req.flash('error', 'Something went wrong');
    res.redirect('/student/login');
  }
});

router.get("/signup",(req,res)=>{
    res.render("student/signup.ejs");
})

// student Dashboard route
router.get('/dashboard', isLoggedIn, wrapAsync(async (req, res) => {
  const studentId = req.user._id;
  const companies = await Company.find({});
  const internships = await Internship.find({})
    .populate('company')
    .sort({ posted_date: -1 })
    .limit(3);
  const student = await Student.findById(studentId);
  res.render('student/home.ejs', { internships, student, companies });
}));

router.get("/profile", isLoggedIn, wrapAsync(async(req,res)=>{
   const student = await Student.findById(req.user._id);
  res.render("student/profile.ejs",{student});
}));
router.get("/internships",wrapAsync(async(req,res)=>{
  const internship = await Internship.find({}).populate('company');
  res.render("student/internships.ejs",{internship});
}));
router.get("/settings",(req,res)=>{
  res.render("student/settings.ejs");
})

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logged out successfully!');
    res.redirect('/');
  });
});

// student id edit
router.get("/:id/edit",async(req,res)=>{
  let id=req.params.id;
  const student = await Student.findById(id);
  res.render("student/edit.ejs",{student});
})

module.exports=router;