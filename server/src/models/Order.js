const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seamster_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: { type: Number, required: true },
  order_status: {
    type: String,
    enum: ["in-progress", "completed", "cancelled"],
    default: "in-progress",
  },
  completion_date: { type: Date },
  created_at: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model("Order", OrderSchema);
