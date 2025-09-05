const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: "voter",
      deviceId: null, // ✅ ensure deviceId field exists
    });
    await user.save();

    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login Route with device restriction
router.post("/login", async (req, res) => {
  const { email, password, deviceId } = req.body; // ✅ get deviceId from frontend

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    let isMatch;
    if (user.password.startsWith("$2a$")) {
      // Hashed password
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password (from Excel import)
      isMatch = password === user.password;
    }

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Device check
    if (!user.deviceId) {
      // First login → store deviceId
      user.deviceId = deviceId;
      await user.save();
    } else if (user.deviceId !== deviceId) {
      // Already registered device → reject if new device
      return res.status(403).json({ message: "Login blocked: new device detected" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
