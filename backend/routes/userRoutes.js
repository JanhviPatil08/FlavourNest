import express from "express";
import { getFavorites, getUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get User Profile
router.get("/me", authMiddleware, getUserProfile);

// ✅ Get User's Favorite Recipes
router.get("/favorites", authMiddleware, getFavorites);

export default router;









