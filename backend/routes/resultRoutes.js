const express = require("express");
const Vote = require("../models/Vote");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get voting results (ADMIN ONLY)
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const results = await Vote.aggregate([
      { $group: { _id: "$candidate", count: { $sum: 1 } } }
    ]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
