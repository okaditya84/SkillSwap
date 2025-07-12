const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('skillsOffered.skillId').populate('skillsWanted');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllPublicUsers = async (req, res) => {
    try {
        const users = await User.find({ isPublic: true }).populate('skillsOffered.skillId').populate('skillsWanted');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch public users' });
    }
};


exports.updateLocation = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { location: req.body.location }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Could not update location' });
    }
};

exports.updatePhotoUrl = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { photoUrl: req.body.photoUrl }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Could not update photoUrl' });
    }
};

exports.updateIsPublic = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { isPublic: req.body.isPublic }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Could not update isPublic' });
    }
};

exports.addSkillOffered = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const exists = user.skillsOffered.find(s => s.skillId.toString() === req.body.skillId);
        if (!exists) {
            user.skillsOffered.push({ skillId: req.body.skillId });
            await user.save();
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Could not add skill offered' });
    }
};

exports.removeSkillOffered = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { skillsOffered: { skillId: req.params.skillId } } },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Could not remove skill offered' });
    }
};

exports.addSkillWanted = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user.skillsWanted.includes(req.body.skillId)) {
            user.skillsWanted.push(req.body.skillId);
            await user.save();
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Could not add skill wanted' });
    }
};

exports.removeSkillWanted = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { skillsWanted: req.params.skillId } },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Could not remove skill wanted' });
    }
};

exports.updateAvailability = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { availability: req.body.availability },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Could not update availability' });
    }
};
