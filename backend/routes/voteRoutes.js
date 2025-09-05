const express = require("express");
const Vote = require("../models/Vote");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Cast a vote
router.post("/", authMiddleware, async (req, res) => {
  const { candidate, deviceId } = req.body; // 👈 receive deviceId from frontend

  try {
    const user = await User.findById(req.user);

    // Check if user already voted
    if (user.hasVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Check if device already voted
    const existingVote = await Vote.findOne({ deviceId });
    if (existingVote) {
      return res.status(400).json({ message: "This device has already voted" });
    }

    // Save the vote
    const vote = new Vote({
      candidate,        // candidate id or name
      voterId: user._id,
      deviceId          // ✅ will now be stored in DB
    });
    await vote.save();

    // Update user as voted
    user.hasVoted = true;
    await user.save();

    res.json({ message: "Vote submitted successfully" });
  } catch (err) {
    console.error("❌ Error in voting route:", err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

module.exports = router;
