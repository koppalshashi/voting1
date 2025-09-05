const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    hasVoted: { type: Boolean, default: false },
    role: { type: String, enum: ["voter", "admin"], default: "voter" },
    deviceId: { type: String, default: null } // ✅ NEW field to lock device
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
