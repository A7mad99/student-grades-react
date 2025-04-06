const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  First_Name: {
    type: String,
    required: true,
    trim: true
  },
  Last_Name: {
    type: String,
    required: true,
    trim: true
  },
  DOB: {
    type: String,
    required: true
  },
  Module1_Grade: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  Module2_Grade: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  Module3_Grade: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);