const { Router } = require('express');
const { body } = require('express-validator');
const { createDeal, getMyDeals, updateDeal, deleteDeal } = require('../controllers/dealController');
const authenticate = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/', getMyDeals);

router.post(
  '/',
  [
    body('entrepreneurId').isMongoId().withMessage('Valid entrepreneur is required'),
    body('amount').notEmpty().withMessage('Amount is required'),
    body('equity').notEmpty().withMessage('Equity is required'),
    body('stage').isIn(['Pre-seed', 'Seed', 'Series A', 'Series B']).withMessage('Invalid stage'),
  ],
  createDeal
);

router.patch('/:id', updateDeal);
router.delete('/:id', deleteDeal);

module.exports = router;