import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 120 },
    amount: { type: Number, required: [true, "Amount is required"], min: [0, "Amount cannot be negative"] },
    category: { type: String, required: [true, "Category is required"], trim: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "netbanking", "other"],
      default: "other",
    },
    date: { type: Date, required: [true, "Date is required"], default: Date.now },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { timestamps: true }
);

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

export default mongoose.model("Expense", expenseSchema);
