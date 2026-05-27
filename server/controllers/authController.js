const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require("../utils/asyncHandler")
const bcrypt = require('bcryptjs');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user
  });
});

const login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  user.password = undefined;

  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 400));
  }

  user.password = newPassword
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  })
})

const generateOtp = asyncHandler(async (req, res, next) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashed = await bcrypt.hash(otp, 12);

  const user = await User.findById(req.user.id);

  user.otpCode = hashed;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();
  res.status(200).json({ success: true, otp});
})

const verifyOtp = asyncHandler(async (req, res, next) => {
  const { otpCode } = req.body;

  const user = await User.findById(req.user.id).select('+otpCode +otpExpiry');

  if(!user.otpCode || !user.otpExpiry) {
    return next(new AppError('OTP not generated', 400))
  }
  
  if(user.otpExpiry < new Date()) {
    return next(new AppError('OTP expired', 400))
  }

  const isMatch = await bcrypt.compare(otpCode, user.otpCode);
  if (!isMatch) {
    return next(new AppError('Invalid OTP', 400));
  }

  await User.findByIdAndUpdate(req.user.id, {
    otpEnabled: true,
    otpCode: null,
    otpExpiry: null,
  })

  res.status(200).json({success: true, message: '2FA enabled successfully' })

})

module.exports = { register, login, getMe, changePassword, generateOtp, verifyOtp };