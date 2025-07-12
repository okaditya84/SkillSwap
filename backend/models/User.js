const mongoose = require('mongoose');
const { Schema } = mongoose;

const SkillSchema = new Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' } // Optional, if skills are user-generated
}, { timestamps: true });

const Skill = mongoose.model('Skill', SkillSchema);

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    location: { type: String },
    photoUrl: { type: String },
    isPublic: { type: Boolean, default: true },
    otp: { type: String }, // For email verification
    // Skills
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
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = { User, Skill };
