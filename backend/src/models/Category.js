import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "🏷️" },
    isPredefined: { type: Boolean, default: false },
  },
  { timestamps: true }
);

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
