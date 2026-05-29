const Stripe = require('stripe');
const { validationResult } = require("express-validator")
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const calculateBalance = (transactions, userId) => {
  return transactions.reduce((acc, tx) => {
    if (tx.type === 'deposit' && tx.to?.toString() === userId.toString()) {
      return acc + tx.amount;
    }
    if (tx.type === 'withdraw' && tx.from?.toString() === userId.toString()) {
      return acc - tx.amount;
    }
    if (tx.type === 'transfer') {
      if (tx.to?.toString() === userId.toString()) return acc + tx.amount;
      if (tx.from?.toString() === userId.toString()) return acc - tx.amount;
    }
    return acc;
  }, 0);
};


const deposit = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new AppError(errors.array()[0].msg, 400));

  const { amount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    metadata: { userId: req.user.id, type: 'deposit' },
    confirm: true,
    payment_method: 'pm_card_visa',
    automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
  });

  const status = paymentIntent.status === 'succeeded' ? 'completed' : 'failed';

  if (status == 'failed') {
    return next(new AppError('Payment failed', 400));
  }

  const transaction = await Transaction.create({
    to: req.user.id,
    type: 'deposit',
    amount,
    status,
    stripePaymentIntentId: paymentIntent.id,
  });

  res.status(201).json({ success: true, transaction });
});

const withdraw = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new AppError(errors.array()[0].msg, 400));

  const { amount } = req.body;
  
  const transactions = await Transaction.find({
    status: 'completed',
    $or: [{ from: req.user.id }, { to: req.user.id }],
  });

  const currentBalance = calculateBalance(transactions, req.user.id);

  if (currentBalance < amount) return next(new AppError('Insufficient balance', 400));

  const transaction = await Transaction.create({
    from: req.user.id,
    type: 'withdraw',
    amount,
    status: 'completed',
  });

  res.status(201).json({ success: true, transaction });
});

const transfer = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new AppError(errors.array()[0].msg, 400));

  const { amount, toUserId } = req.body;

  if (toUserId === req.user.id.toString()) {
    return next(new AppError('Cannot transfer to yourself', 400));
  }

  const recipient = await User.findById(toUserId);
  if (!recipient) return next(new AppError('Recipient not found', 404));

  const transactions = await Transaction.find({
    status: 'completed',
    $or: [{ from: req.user.id }, { to: req.user.id }],
  });

  const currentBalance = calculateBalance(transactions, req.user.id);

  if (currentBalance < amount) return next(new AppError('Insufficient balance', 400));

  const transaction = await Transaction.create({
    from: req.user.id,
    to: recipient._id,
    type: 'transfer',
    amount,
    status: 'completed',
  });

  res.status(201).json({ success: true, transaction });
});

const getHistory = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ from: req.user.id }, { to: req.user.id }],
  })
    .populate('from', 'name email')
    .populate('to', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, transactions });
});

const getBalance = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    status: 'completed',
    $or: [{ from: req.user.id }, { to: req.user.id }],
  });

  const balance = calculateBalance(transactions, req.user.id);

  res.status(200).json({ success: true, balance });
});

module.exports = { deposit, withdraw, transfer, getHistory, getBalance };