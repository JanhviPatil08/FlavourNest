import express from "express";
import { getFavoriteRecipes, toggleFavouriteRecipe, getUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get User Profile
router.get("/me", authMiddleware, getUserProfile);

// ✅ Get User's Favorite Recipes
router.get("/favorites", authMiddleware, getFavoriteRecipes);
router.post("/favorites", authMiddleware, toggleFavouriteRecipe); 

export default router;









