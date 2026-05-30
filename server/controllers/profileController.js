const EntrepreneurProfile = require('../models/EntrepreneurProfile');
const InvestorProfile = require('../models/InvestorProfile');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getEntrepreneurProfile = asyncHandler(async (req, res) => {
  const profile = await EntrepreneurProfile.findOne({ user: req.params.userId });
  
  if (!profile) {
    return next(new AppError('Entrepreneur profile not found', 404));
  }

  await profile.populate('user', 'name email');

  res.status(200).json({ success: true, profile });
});

const updateEntrepreneurProfile = asyncHandler(async (req, res, next) => {
  if (req.params.userId !== req.user.id) {
    return next(new AppError('You can only update your own profile', 403));
  }

  const { startupName, industry, pitchSummary, fundingNeeded, location, foundedYear, teamSize } = req.body;

  const updateData = Object.fromEntries(
    Object.entries({ startupName, industry, pitchSummary, fundingNeeded, location, foundedYear, teamSize })
      .filter(([_, v]) => v !== undefined)
  );

  const profile = await EntrepreneurProfile.findOneAndUpdate(
    { user: req.params.userId },
    updateData,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ success: true, profile });
});

const getInvestorProfile = asyncHandler(async (req, res) => {
  const profile = await InvestorProfile.findOne({ user: req.params.userId });

  if (!profile) {
    return next(new AppError('Investor profile not found', 404));
  }

  await profile.populate('user', 'name email');

  res.status(200).json({ success: true, profile });
});

const updateInvestorProfile = asyncHandler(async (req, res, next) => {
  if (req.params.userId !== req.user.id) {
    return next(new AppError('You can only update your own profile', 403));
  }

  const { investmentInterests, investmentStage, portfolioCompanies, minimumInvestment, maximumInvestment, totalInvestments } = req.body;

  const updateData = Object.fromEntries(
    Object.entries({ investmentInterests, investmentStage, portfolioCompanies, minimumInvestment, maximumInvestment, totalInvestments })
      .filter(([_, v]) => v !== undefined)
  );

  const profile = await InvestorProfile.findOneAndUpdate(
    { user: req.params.userId },
    updateData,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ success: true, profile });
});

module.exports = { getEntrepreneurProfile, updateEntrepreneurProfile, getInvestorProfile, updateInvestorProfile };