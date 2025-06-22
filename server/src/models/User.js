const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    user_role: {
      type: String,
      required: true,
      enum: ["customer", "seamster"],
    },
    password_hash: { type: String, required: true },
    phone: { type: String, required: true, length: 10 },
    email: { type: String, required: true, unique: true },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    profile_picture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      // required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
