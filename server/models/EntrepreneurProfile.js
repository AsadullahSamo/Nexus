const mongoose = require('mongoose');

const entrepreneurProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    startupName: { 
        type: String, 
        default: '' 
    },
    industry: { 
        type: String, 
        default: '' 
    },
    pitchSummary: { 
        type: String, 
        default: '' 
    },
    fundingNeeded: { 
        type: String, 
        default: '' 
    },
    location: { 
        type: String, 
        default: '' 
    },
    foundedYear: { 
        type: Number, 
        default: null 
    },
    teamSize: { 
        type: Number, 
        default: null 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EntrepreneurProfile', entrepreneurProfileSchema);