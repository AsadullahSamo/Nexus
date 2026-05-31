const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({ success: true, user });
});

const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(200).json({ success: true, users: [] });
  }

  const users = await User.find({
    _id: { $ne: req.user._id },
    name: { $regex: q, $options: 'i' },
  }).select('name avatar role').limit(10);

  res.status(200).json({ success: true, users });
});

const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, bio, avatar } = req.body;

  const updateData = Object.fromEntries(
    Object.entries({ name, bio, avatar })
      .filter(([_, value]) => value !== undefined)
  );

  if (req.params.id !== req.user._id.toString()) {
    return next(new AppError('You can only update your own profile', 403));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({ success: true, user });
});

const uploadAvatar = asyncHandler(async (req, res, next) => {
  if(!req.file) return next(new AppError("No file uploaded", 400));

  if (req.params.id !== req.user.id.toString()) {
    return next(new AppError('You can only update your own avatar', 403));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {avatar: req.file.filename},
    {new: true}
  )

  if(!user) return next(new AppError("User not found", 404));

  res.status(200).json({ success: true, user })

})

module.exports = { getUserById, updateProfile, searchUsers, uploadAvatar };