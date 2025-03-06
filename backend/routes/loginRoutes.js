import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/loginController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Register & Login Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Fix `/auth/me` route
router.get("/me", authMiddleware, getUserProfile);

export default router;







