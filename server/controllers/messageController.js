const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $lt: ['$sender', '$receiver'] },
            { a: '$sender', b: '$receiver' },
            { a: '$receiver', b: '$sender' },
          ],
        },
        lastMessage: { $first: '$$ROOT' },
      },
    },
    { $replaceRoot: { newRoot: '$lastMessage' } },
    { $sort: { createdAt: -1 } },
  ]);

  const populated = await Message.populate(conversations, [
    { path: 'sender', select: 'name avatar role' },
    { path: 'receiver', select: 'name avatar role' },
  ]);

  res.status(200).json({ success: true, conversations: populated });
});

const getMessages = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new AppError('Invalid user ID', 400));
  }

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: 1 });

  await Message.updateMany(
    { sender: userId, receiver: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({ success: true, messages });
});

const sendMessage = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new AppError('Invalid user ID', 400));
  }

  if (!content?.trim()) {
    return next(new AppError('Message content is required', 400));
  }

  const receiver = await User.findById(userId);
  if (!receiver) return next(new AppError('User not found', 404));

  const message = await Message.create({
    sender: req.user._id,
    receiver: userId,
    content: content.trim(),
  });

  await message.populate([
    { path: 'sender', select: 'name avatar' },
    { path: 'receiver', select: 'name avatar' },
  ]);

  res.status(201).json({ success: true, message });
});

module.exports = { getConversations, getMessages, sendMessage };