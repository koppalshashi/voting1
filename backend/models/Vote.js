const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  candidate: { type: String, required: true },
  voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Vote", voteSchema);
