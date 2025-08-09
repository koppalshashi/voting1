const express = require("express");
const Candidate = require("../models/Candidate");
const router = express.Router();

// Get all candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

// Add a new candidate
router.post("/", async (req, res) => {
  try {
    const { name, image } = req.body;
    const newCandidate = new Candidate({ name, image });
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ error: "Failed to add candidate" });
  }
});

module.exports = router;
