import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/loginController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// ✅ Register Route
router.post("/register", registerUser);

// ✅ Login Route
router.post("/login", loginUser);

// ✅ Get Logged-in User Info (Fix for /auth/me Not Found)
router.get("/me", authMiddleware, getUserProfile);

export default router;







