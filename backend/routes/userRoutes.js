import express from "express";
import { getFavouriteRecipes, toggleFavouriteRecipe, getUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get User Profile
router.get("/me", authMiddleware, getUserProfile);

// ✅ Get User's Favorite Recipes
router.get("/favourites", authMiddleware, getFavouriteRecipes);
router.post("/favourites", authMiddleware, toggleFavouriteRecipe); 

export default router;









