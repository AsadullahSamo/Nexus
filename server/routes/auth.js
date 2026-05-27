const { Router } = require('express');
const { body } = require('express-validator');
const { register, login, getMe, changePassword, generateOtp, verifyOtp } = require('../controllers/authController');
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

router.patch(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  changePassword
);

router.post('/2fa/generate', authenticate, generateOtp)

router.post(
  '/2fa/verify',
  authenticate,
  [ 
    body('otpCode')
    .matches(/^\d{6}$/)
    .withMessage('OTP must be a 6-digit number')
  ],
  verifyOtp
)

module.exports = router;