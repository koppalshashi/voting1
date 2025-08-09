const express = require("express");
const Vote = require("../models/Vote");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Cast a vote
router.post("/", authMiddleware, async (req, res) => {
  const { candidate } = req.body;

  try {
    const user = await User.findById(req.user);
    if (user.hasVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const vote = new Vote({ candidate, voterId: user._id });
    await vote.save();

    user.hasVoted = true;
    await user.save();

    res.json({ message: "Vote submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
