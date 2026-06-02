const Deal = require('../models/Deal');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require('../utils/createNotification');

const createDeal = asyncHandler(async (req, res, next) => {
  const { entrepreneurId, amount, equity, stage, notes } = req.body;

  if (req.user.role !== 'investor') {
    return next(new AppError('Only investors can create deals', 403));
  }

  const entrepreneur = await User.findById(entrepreneurId);
  if (!entrepreneur || entrepreneur.role !== 'entrepreneur') {
    return next(new AppError('Entrepreneur not found', 404));
  }

  const deal = await Deal.create({
    investor: req.user._id,
    entrepreneur: entrepreneurId,
    amount,
    equity,
    stage,
    notes,
  });

  await deal.populate(['investor', 'entrepreneur']);

  await createNotification({
    recipient: entrepreneurId,
    type: 'deal_created',
    title: 'New Investment Deal',
    body: `${req.user.name} has initiated a deal with you`,
    link: '/deals',
  });

  res.status(201).json({ success: true, deal });
});

const getMyDeals = asyncHandler(async (req, res) => {
  const query = req.user.role === 'investor'
    ? { investor: req.user._id }
    : { entrepreneur: req.user._id };

  const deals = await Deal.find(query)
    .populate('investor', 'name avatar role')
    .populate('entrepreneur', 'name avatar role')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, deals });
});

const updateDeal = asyncHandler(async (req, res, next) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) return next(new AppError('Deal not found', 404));

  const entrepreneurId = deal.entrepreneur.toString();

  if (deal.investor.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the investor can update this deal', 403));
  }

  const { amount, equity, stage, status, notes } = req.body;
  const updateData = Object.fromEntries(
    Object.entries({ amount, equity, stage, status, notes })
      .filter(([_, v]) => v !== undefined)
  );

  Object.assign(deal, updateData);
  await deal.save();
  await deal.populate(['investor', 'entrepreneur']);

  await createNotification({
    recipient: entrepreneurId,
    type: 'deal_updated',
    title: 'Investment Deal Updated',
    body: `${req.user.name} has updated a deal with you`,
    link: '/deals',
  });

  res.status(200).json({ success: true, deal });
});

const deleteDeal = asyncHandler(async (req, res, next) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) return next(new AppError('Deal not found', 404));

  const entrepreneurId = deal.entrepreneur.toString();

  if (deal.investor.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the investor can delete this deal', 403));
  }

  await deal.deleteOne();

  await createNotification({
    recipient: entrepreneurId,
    type: 'deal_deleted',
    title: 'Investment Deal Deleted',
    body: `${req.user.name} has deleted a deal with you`,
    link: '/deals',
  });

  res.status(200).json({ success: true, message: 'Deal deleted' });
});

module.exports = { createDeal, getMyDeals, updateDeal, deleteDeal };