const express = require('express');
const router = express.Router();
const User = require('../models/User').User || require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, sendEmailOTP } = require('../utils/sendOtp');
const { sendMobileOTP } = require('../utils/sendMobileOtp');

// Signup
router.post('/register', async (req, res) => {
    const { email, mobile, password } = req.body;

    if (!email && !mobile) {
        return res.status(400).json({ message: 'Email or Mobile required' });
    }

    const existing = await User.findOne({ $or: [{ email }, { mobile }] });

    if (existing) {
        if (existing.isVerified === true) {
            return res.status(409).json({ message: 'User already exists' });
        } else {
            // Delete unverified user before creating a new one
            await User.deleteOne({ _id: existing._id });
        }
    }

    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
        name,
        email,
        mobile,
        passwordHash: hashed,
        otp,
        otpExpiry: Date.now() + 10 * 60 * 1000,
    });

    if (email) await sendEmailOTP(email, otp);
    if (mobile) await sendMobileOTP(mobile, otp);

    res.json({ message: 'OTP sent', userId: user._id });
});

// Login (email or mobile)
router.post('/login', async (req, res) => {
    const { email, mobile, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { mobile }] });
    if (!user) return res.status(404).json({ message: 'User not found' });



    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    if (email) await sendEmailOTP(email, otp);
    if (mobile) await sendMobileOTP(mobile, otp);

    res.json({ message: 'OTP sent', userId: user._id });
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, message: 'Login successful' });
});

module.exports = router;
