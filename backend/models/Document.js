const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true,
  },
  cid: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mintedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", DocumentSchema);
