import mongoose from 'mongoose';

const earningSchema = new mongoose.Schema({
  earnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sourceUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
  amount: Number,
  level: Number,
},{ timestamps: true});

export const Earning = mongoose.model('Earning', earningSchema);
