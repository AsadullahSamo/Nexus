const { Router } = require('express');
const { body } = require('express-validator');
const { deposit, withdraw, transfer, getHistory, getBalance } = require('../controllers/transactionController');
const authenticate = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/history', getHistory);
router.get('/balance', getBalance);

router.post(
  '/deposit',
  [body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least $1')],
  deposit
);

router.post(
  '/withdraw',
  [body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least $1')],
  withdraw
);

router.post(
  '/transfer',
  [
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least $1'),
    body('toUserId').isMongoId().withMessage('Valid recipient is required'),
  ],
  transfer
);

module.exports = router;