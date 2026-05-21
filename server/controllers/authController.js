const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require("../utils/asyncHandler")

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { fullName, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  const user = await User.create({ fullName, email, password, role });
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

module.exports = { register, login, getMe };