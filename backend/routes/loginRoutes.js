import express from "express";
import loginController from "../controllers/loginController.js";  // Import default object

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Register & Login Routes
router.post("/register", loginController.registerUser);
router.post("/login", loginController.loginUser);

// ✅ Protected route to get user profile
router.get("/me", authMiddleware, loginController.getUserProfile);

// ✅ Logout route
router.post("/logout", authMiddleware, loginController.logoutUser);

export default router;
