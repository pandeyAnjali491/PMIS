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
const { studentSchema, companySchema } = require('../schema.js');

// passport
const passport = require('passport');

// Middleware to check if company is authenticated
const isCompanyLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in first!');
    return res.redirect('/company/login');
  }
  next();
};

// Joi validation middleware (generalized)
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

// company data posting
router.post("/",validate(companySchema),wrapAsync(async(req,res)=>{
    const data = req.body.data;
    const { password } = data;
    delete data.password; // Remove password from data object

    const newCompany = new Company(data);
    const registeredCompany = await Company.register(newCompany, password);

    req.flash("success","Registered successfully! Please login.");
    res.redirect("/company/login");
}));


router.get("/login",(req,res)=>{
    res.render("company/login.ejs");
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });

    if (!company) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/company/login');
    }

    const result = await company.authenticate(password);

    if (!result || result.error) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/company/login');
    }

    // Set user session
    req.login(result.user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome back!');
      res.redirect('/company/dashboard');
    });
  } catch (err) {
    req.flash('error', 'Something went wrong');
    res.redirect('/company/login');
  }
});

router.get("/signup",(req,res)=>{
    res.render("company/signup.ejs");
})

// Company Home Dashboard (enhanced view similar to student dashboard)
router.get('/dashboard', isCompanyLoggedIn, wrapAsync(async (req, res) => {
    const companyId = req.user._id;
    let company = await Company.findById(companyId);
    const internships = await Internship.find({ company: companyId });
    // Placeholder applications array (replace with real Application model queries)
    const applications = [];
    // Basic stats (will adjust when applications model integrated)
    const stats = {
      totalInternships: internships.length,
      activeInternships: internships.filter(i => i.status === 'Active').length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'Pending').length,
    };

    res.render('company/home', { company, internships, stats, applications });
}));

// edit company profile
router.put("/:id",wrapAsync(async(req,res)=>{
    let id=req.params.id;
    const data = req.body.data;
    await Company.findByIdAndUpdate(id,data);
    req.flash("success","updated successfully");
    res.redirect(`/company/profile/${id}`);
}));

router.get("/profile/:id/edit", async (req, res) => {
  let id = req.params.id;
  let company = await Company.findById(id);
  res.render("company/edit", { company });
});

// create
router.get("/internships/new",(req,res)=>{
  res.render("company/postInternship.ejs");
})


router.post("/internships", isCompanyLoggedIn, async(req,res)=>{
    let data = req.body.data;
    data.company = req.user._id;
    console.log(data);
    let new_data = new Internship(data);
    await new_data.save();
    req.flash('success', 'Internship posted successfully!');
    res.redirect("/company/dashboard");
});

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

router.get("/profile/:id",async(req,res)=>{
   let id = req.params.id;
  let company = await Company.findById(id);
    res.render("company/profile",{company});
})


// perticular internship details
router.get("/internships/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const internship = await Internship.findById(id).populate('company');
  res.render("internships/showInternship.ejs",{internship});
}));

module.exports = router;