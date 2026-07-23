import express from "express";
import { getSummary, getChartData } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/summary", getSummary);
router.get("/charts", getChartData);

export default router;
