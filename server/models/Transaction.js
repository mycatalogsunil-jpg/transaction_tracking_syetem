import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "upi",
        "bank_transfer",
        "credit_card",
        "debit_card",
        "wallet",
        "other",
      ],
      default: "cash",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled", "refunded"],
      default: "completed",
      index: true,
    },
    referenceNumber: {
      type: String,
      trim: true,
      default: "",
    },
    transactionDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, transactionDate: -1 });

export default mongoose.model("Transaction", transactionSchema);
