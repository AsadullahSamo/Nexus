const { Router } = require('express');
const { getUserById, updateProfile } = require('../controllers/userController');
const authenticate = require('../middlewares/auth');

const router = Router();

router.get('/:id', authenticate, getUserById);
router.patch('/:id', authenticate, updateProfile);

module.exports = router;