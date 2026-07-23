import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    score: { type: Number, min: 0, max: 100, required: true },
    summary: { type: String, required: true },
    recommendations: { type: [String], default: [] },
    budgetSuggestions: [
      {
        category: String,
        suggestedLimit: Number,
      },
    ],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("AIInsight", aiInsightSchema);
