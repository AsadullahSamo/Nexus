const { Router } = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const authenticate = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['entrepreneur', 'investor']).withMessage('Role must be entrepreneur or investor'),
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', authenticate, getMe);

module.exports = router;