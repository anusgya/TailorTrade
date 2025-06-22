const mongoose = require("mongoose");

const SeamsterSchema = new mongoose.Schema({
  seamster_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  bio: { type: String },
  total_bids_made: { type: Number, default: 0 },
  total_bids_won: { type: Number, default: 0 },
  success_rate: { type: Number, default: 0 },
  average_ratings: { type: Number, default: 0 },
  repeated_customers: { type: Number, default: 0 },
  total_revenue: { type: Number, default: 0 },
});

module.exports = mongoose.model("Seamster", SeamsterSchema);
