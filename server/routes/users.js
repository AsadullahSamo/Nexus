const { Router } = require('express');
const { getUserById, updateProfile, searchUsers } = require('../controllers/userController');
const authenticate = require('../middlewares/auth');

const router = Router();

router.get('/', authenticate, searchUsers);
router.get('/:id', authenticate, getUserById);
router.patch('/:id', authenticate, updateProfile);

module.exports = router;