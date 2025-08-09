// backend/routes/formSyncRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const SHARED_HEADER = "x-form-secret";

router.post("/", async (req, res) => {
  try {
    const incomingSecret = req.header(SHARED_HEADER);
    if (!incomingSecret || incomingSecret !== process.env.FORM_SHARED_SECRET) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email, username } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await User.findOne({ email });

    if (existing) {
      existing.name = name || existing.name;
      existing.username = username || existing.username;
      await existing.save();
      return res.json({ message: "User updated", userId: existing._id });
    } else {
      const rawPassword = Math.random().toString(36).slice(-8);
      const hashed = await bcrypt.hash(rawPassword, 10);

      const newUser = new User({
        name,
        email,
        username,
        password: hashed,
        role: "voter",
        hasVoted: false
      });
      await newUser.save();
      return res.status(201).json({ message: "User created", userId: newUser._id });
    }
  } catch (err) {
    console.error("Form sync error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
