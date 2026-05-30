const mongoose = require('mongoose');

const investorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    investmentInterests: { 
        type: [String], 
        default: [] 
    },
    investmentStage: { 
        type: [String], 
        default: [] 
    },
    portfolioCompanies: { 
        type: [String], 
        default: [] 
    },
    minimumInvestment: { 
        type: String, 
        default: '' 
    },
    maximumInvestment: { 
        type: String, 
        default: '' 
    },
    totalInvestments: { 
        type: Number, 
        default: 0 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InvestorProfile', investorProfileSchema);