const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bid", bidSchema);
