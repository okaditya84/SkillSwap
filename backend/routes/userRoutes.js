const express = require('express');
const router = express.Router();
const {
    updateLocation,
    updatePhotoUrl,
    updateIsPublic,
    addSkillOffered,
    removeSkillOffered,
    addSkillWanted,
    removeSkillWanted,
    updateAvailability,
    getProfile
} = require('../controllers/userController');

const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/:userId/me', getProfile);
router.get('/public/all', getAllPublicUsers);

router.patch('/:userId/location', updateLocation);
router.patch('/:userId/photo', updatePhotoUrl);
router.patch('/:userId/public', updateIsPublic);

router.post('/:userId/skills-offered', addSkillOffered);
router.delete('/:userId/skills-offered/:skillId', removeSkillOffered);

router.post('/:userId/skills-wanted', addSkillWanted);
router.delete('/:userId/skills-wanted/:skillId', removeSkillWanted);

router.put('/:userId/availability', updateAvailability);

module.exports = router;
