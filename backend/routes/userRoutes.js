import express from "express";
import { getFavouriteRecipes, toggleFavouriteRecipe, getUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get User Profile
router.get("/me", authMiddleware, getUserProfile);

// ✅ Get User's Favorite Recipes
router.get("/savedRecipes", authMiddleware, getFavouriteRecipes);
router.post("/savedRecipes", authMiddleware, toggleFavouriteRecipe); 

export default router;










