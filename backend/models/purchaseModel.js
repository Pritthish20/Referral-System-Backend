import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    profit: Number,
  },
  { timestamps: true }
);

export const Purchase = mongoose.model("Purchase", purchaseSchema);
