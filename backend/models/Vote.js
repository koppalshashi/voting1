const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    candidate: { type: String, required: true }, // or ObjectId if you link to Candidate model
    voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deviceId: { type: String, required: true, unique: true } // ✅ new field (unique so 1 device = 1 vote)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteSchema);
