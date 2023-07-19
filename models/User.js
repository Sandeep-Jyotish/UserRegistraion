const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
});

module.exports = mongoose.model("User", userSchema);
