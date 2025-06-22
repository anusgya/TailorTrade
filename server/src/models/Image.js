const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  contentType: String,
  type: { type: String, enum: ["profilePic", "postImage"], required: true }, // Add type field
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
