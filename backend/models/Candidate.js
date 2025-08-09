// models/Candidate.js
const mongoose = require("mongoose");

// Define the schema for a candidate
const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  votes: {
    type: Number,
    default: 0
  },
  image: {
    type: String, // URL or path to the candidate's image
    default: ""
  }
});

// Export the Candidate model
module.exports = mongoose.model("Candidate", candidateSchema);
