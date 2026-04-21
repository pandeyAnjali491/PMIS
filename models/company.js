const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const passportLocalMongoose = require('passport-local-mongoose');


const company = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
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
  industry_type: {
    type: String,
    required: true
  },
  job_type: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  hr_name: {
    type: String,
    required: true
  },
  hr_email: {
    type: String,
    required: true,
    lowercase: true
  },
  hr_phone: {
    type: String,
    required: true,
  },
  
  registration_date: {
    type: Date,
    default: Date.now
  }
});

company.plugin(passportLocalMongoose, { usernameField: 'email' });

const Company = mongoose.model('Company', company);
module.exports = Company;