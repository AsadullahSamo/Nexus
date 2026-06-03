const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require('../utils/createNotification');

const uploadDocument = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400));

  const document = await Document.create({
    name: req.body.name || req.file.originalname,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.filename,
    uploadedBy: req.user._id,
  });

  await document.populate('uploadedBy', 'name avatar');

  res.status(201).json({ success: true, document });
});

const getMyDocuments = asyncHandler(async (req, res) => {
  const [owned, shared] = await Promise.all([
    Document.find({ uploadedBy: req.user._id })
      .populate('uploadedBy', 'name avatar')
      .populate('sharedWith', 'name avatar')
      .sort({ createdAt: -1 }),
    Document.find({ sharedWith: req.user._id })
      .populate('uploadedBy', 'name avatar')
      .populate('sharedWith', 'name avatar')
      .sort({ createdAt: -1 }),
  ]);

  res.status(200).json({ success: true, documents: owned, sharedDocuments: shared });
});

const deleteDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);
  if (!document) return next(new AppError('Document not found', 404));

  if (document.uploadedBy.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to delete this document', 403));
  }

  const filePath = path.join(__dirname, '../uploads', document.path);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await document.deleteOne();
  res.status(200).json({ success: true, message: 'Document deleted' });
});

const downloadDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);
  if (!document) return next(new AppError('Document not found', 404));

  const isOwner = document.uploadedBy.toString() === req.user._id.toString();
  const isShared = document.sharedWith.map(String).includes(req.user._id.toString());

  if (!isOwner && !isShared) {
    return next(new AppError('Not authorized to access this document', 403));
  }

  const filePath = path.join(__dirname, '../uploads', document.path);
  if (!fs.existsSync(filePath)) return next(new AppError('File not found on server', 404));

  res.download(filePath, document.originalName);
});

const saveSignature = asyncHandler(async (req, res, next) => {
  const { signature } = req.body;

  if (!signature) return next(new AppError('Signature is required', 400));
  

  const document = await Document.findById(req.params.id);
  if (!document) return next(new AppError('Document not found', 404));
  
  if (document.uploadedBy.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to sign this document', 403));
  }

  if (document.signature) {
    return next(new AppError('Document already signed', 400));
  }

  document.signature = signature;
  await document.save();

  res.status(200).json({ success: true, document });
});

const shareDocument = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const document = await Document.findById(req.params.id);
  if (!document) return next(new AppError('Document not found', 404));

  if (document.uploadedBy.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the owner can share this document', 403));
  }

  if (document.sharedWith.map(String).includes(userId)) {
    return next(new AppError('Already shared with this user', 400));
  }

  document.sharedWith.push(userId);
  await document.save();
  await document.populate('sharedWith', 'name avatar');

  await createNotification({
    recipient: userId,
    type: 'document_shared',
    title: 'Document Shared',
    body: `${req.user.name} shared "${document.name}" with you`,
    link: '/documents',
  });

  res.status(200).json({ success: true, document });
});

const unshareDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);
  if (!document) return next(new AppError('Document not found', 404));

  if (document.uploadedBy.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the owner can unshare this document', 403));
  }

  document.sharedWith = document.sharedWith.filter(
    (id) => id.toString() !== req.params.userId
  );
  await document.save();

  res.status(200).json({ success: true, message: 'User removed from shared list' });
});

module.exports = { uploadDocument, getMyDocuments, deleteDocument, downloadDocument, saveSignature, shareDocument, unshareDocument };