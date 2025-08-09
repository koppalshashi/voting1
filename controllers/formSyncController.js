const User = require("../models/User");

exports.syncFormData = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user
      user.name = name;
      user.username = username;
      user.password = password; // ⚠ Store securely (hash later)
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        username,
        password // ⚠ Store securely (hash later)
      });
      await user.save();
    }

    res.status(200).json({ message: "User data synced successfully" });
  } catch (error) {
    console.error("Form Sync Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
