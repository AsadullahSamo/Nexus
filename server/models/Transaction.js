const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: ['deposit', 'withdraw', 'transfer'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Amount must be at least $1'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ from: 1, createdAt: -1 });
transactionSchema.index({ to: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ status: 1, from: 1 });
transactionSchema.index({ status: 1, to: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);