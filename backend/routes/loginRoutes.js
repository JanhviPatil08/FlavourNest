import express from "express";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/loginController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Register & Login Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Protected route to get user profile
router.get("/me", authMiddleware, getUserProfile);

// ✅ Logout route
router.post("/logout", authMiddleware, logoutUser);

export default router;








