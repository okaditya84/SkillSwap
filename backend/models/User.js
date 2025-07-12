const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false },
    googleId: String,
    location: { type: String },
    photoUrl: { type: String },
    isPublic: { type: Boolean, default: true },
    skillsOffered: [{
        skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
        badge: { type: String, enum: ['gold', 'silver', 'bronze', 'none'], default: 'none' },
        verifiedAt: { type: Date },
        testCooldownUntil: { type: Date } // future date if failed test
    }],
    skillsWanted: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],

    // Availability
    availability: [{
        slot: { type: String, enum: ['weekdays', 'weekends', 'evenings', 'mornings', 'custom'] },
        details: { type: String } // e.g., "Mon-Fri 5-7PM"
    }]

});

module.exports = mongoose.model('User', userSchema);
