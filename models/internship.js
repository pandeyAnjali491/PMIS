const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const internshipSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String, // Remote / On-site / Hybrid / City Name
    required: true
  },
  mode: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
    required: true
  },
  duration: {
    type: String, // e.g., "3 Months", "6 Weeks"
    required: true
  },
  stipend: {
    type: String, // e.g., "₹5000/month" or "Unpaid"
    default: 'Unpaid'
  },
  perks: {
    type: String, // e.g., ["Certificate", "Letter of Recommendation", "Flexible Hours"]
  },
  skills_required: {
    type: String, // e.g., ["JavaScript", "React", "Node.js"]
    required: true
  },
  openings: {
    type: Number,
    required: true,
    default: 1
  },
  application_deadline: {
    type: Date,
    required: true
  },
  posted_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active'
  },

  // Reference to company
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
});

const Internship = mongoose.model('Internship', internshipSchema);
module.exports = Internship;
