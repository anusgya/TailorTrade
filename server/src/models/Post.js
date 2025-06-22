const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  category_name: {
    type: String,
    enum: ["Casual", "Formal", "Sport", "Ethnic", "Outer"],
    required: true,
  },
  description: { type: String, required: true },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  },
  fabric: { type: String, required: true },
  pattern: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  bidding_due_date: { type: Date, required: true },
  required_by: { type: Date, required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  total_offers: { type: Number, default: 0 },
});

PostSchema.index({
  title: "text",
  description: "text",
  fabric: "text",
  pattern: "text",
  color: "text",
  size: "text",
  category_name: "text",
});
module.exports = mongoose.model("Post", PostSchema);
