const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: { 
        type: String, 
        required: true 
    },
    equity: { 
        type: String, 
        required: true 
    },
    stage: {
      type: String,
      enum: ['Pre-seed', 'Seed', 'Series A', 'Series B'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Due Diligence', 'Term Sheet', 'Negotiation', 'Closed', 'Passed'],
      default: 'Due Diligence',
    },
    notes: { 
        type: String, 
        default: '' 
    },
  },
  { timestamps: true }
);

dealSchema.index({ investor: 1, createdAt: -1 });
dealSchema.index({ entrepreneur: 1, createdAt: -1 });

module.exports = mongoose.model('Deal', dealSchema);