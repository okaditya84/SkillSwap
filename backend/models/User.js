const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false },
    googleId: String,
});

module.exports = mongoose.model('User', userSchema);
