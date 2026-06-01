const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require("../utils/createNotification")

const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const conversations = await Message.aggregate([
    {
      $match: {
        isDeleted: false,
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

  await createNotification({
    recipient: userId,
    type: 'new_message',
    title: 'New Message',
    body: `${req.user.name} sent you a message`,
    link: `/chat/${req.user._id}`,
  });

  res.status(201).json({ success: true, message });
});

const deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.messageId);
  if (!message) return next(new AppError('Message not found', 404));
  if (message.sender.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only delete your own message', 403));
  }
  message.isDeleted = true;
  message.content = 'This message was deleted';
  
  await message.save();
  res.status(200).json({ success: true, message });
});

const editMessage = asyncHandler(async (req, res, next) => {
  const message  = await Message.findById(req.params.messageId);
  if (!message) return next(new AppError('Message not found', 404));
  if (message.sender.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only delete your own message', 403));
  }

  const { content } = req.body;
  if (!content?.trim()) {
    return next(new AppError('Message content is required', 400));
  }

  message.isEdited = true;
  message.content = content.trim();

  await message.save();
  res.status(200).json({ success: true, message });

})


module.exports = { getConversations, getMessages, sendMessage, deleteMessage, editMessage };