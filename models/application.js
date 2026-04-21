const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',  
    required: true
  },
  internship: {
    type: Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  resume: {
    type: String, 
    required: true
  },
  cover_letter: {
    type: String // Optional short note from student
  },
  applied_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update updated_date on every save
applicationSchema.pre('save', function (next) {
  this.updated_date = Date.now();
  next();
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
