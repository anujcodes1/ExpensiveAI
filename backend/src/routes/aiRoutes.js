import express from "express";
import { analyzeExpenses, getLatestInsight } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.post("/analyze", analyzeExpenses);
router.get("/insights", getLatestInsight);

export default router;
