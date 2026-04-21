const mongoose = require('mongoose'); // Import mongoose
const Schema = mongoose.Schema; // Create a Schema
const passportLocalMongoose = require('passport-local-mongoose');


const student = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  course:{
    type: String,
    required: true
  },
   yearOfGraduation: {
    type: Number,
    min: 2000,
    max: 2099,
    required: true
  },
  skills: {
    type: String, 
  },
  preferred_domain: {
    type: String,
    required: true
  },
  internship_type: {
    type: String,
    enum: ["Remote", "Onsite", "Hybrid"],
    default: "Remote",
    required: true
  },
  registration_date: {
    type: Date,
    default: Date.now
  },
});

student.plugin(passportLocalMongoose, { usernameField: 'email' });

const Student = mongoose.model('Student', student); // Create a model based on the schema


module.exports = Student; 