const { Router } = require('express');
const upload = require('../config/multer');
const { getUserById, updateProfile, searchUsers, uploadAvatar } = require('../controllers/userController');
const authenticate = require('../middlewares/auth');

const router = Router();

router.get('/', authenticate, searchUsers);
router.get('/:id', authenticate, getUserById);
router.patch('/:id', authenticate, updateProfile);
router.patch("/:id/avatar", authenticate, upload.single("avatar"), uploadAvatar)

module.exports = router;