import express from "express";
import { updateProfile, changePassword } from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.put("/", updateProfile);
router.put("/password", changePassword);

export default router;
