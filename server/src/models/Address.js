const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  province: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
});

module.exports = mongoose.model("Address", AddressSchema);
