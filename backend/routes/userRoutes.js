const express = require('express');
const router = express.Router();
const User = require('../models/User').User || require('../models/User');

router.get('/:userId/me', async (req, res) => {
    try {
        if (!req.params.userId) {
            return res.status(400).json({ error: 'Missing userId parameter' });
        }
        console.log('Fetching user profile for:', req.params.userId);
        const user = await User.findOne({ _id: req.params.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User found:', user);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/public/all', async (req, res) => {
    try {
        const users = await User.find({ isPublic: true }).populate('skillsOffered.skillId').populate('skillsWanted');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch public users' });
    }
});
router.patch('/:userId/location', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { location: req.body.location }, { new: true })
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Could not update location' });
    }
});
router.patch('/:userId/photo', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { photoUrl: req.body.photoUrl }, { new: true })
        res.json(user)
    } catch (err) {
        res.status(500).json({ error: 'Could not update photoUrl' });
    }
});

router.patch('/:userId/public', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { isPublic: req.body.isPublic }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Could not update isPublic' });
    }
});

router.post('/:userId/skills-offered', async (req, res) => {
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
});

router.delete('/:userId/skills-offered/:skillId', async (req, res) => {
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
});

router.post('/:userId/skills-wanted', async (req, res) => {
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
});

router.delete('/:userId/skills-wanted/:skillId', async (req, res) => {
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
});

router.put('/:userId/availability', async (req, res) => {
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
});

module.exports = router;
