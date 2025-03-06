import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { saveFavoriteRecipe, getFavoriteRecipes, removeFavoriteRecipe, getUserProfile } from "../controllers/userController.js";

const router = express.Router();

// ✅ Save (Like) a Recipe to Favorites
router.post("/users/favorites", authMiddleware, saveFavoriteRecipe);

// ✅ Get User's Favorite Recipes
router.get("/users/favorites", authMiddleware, getFavoriteRecipes);

// ✅ Remove a Recipe from Favorites
router.delete("/users/favorites/:id", authMiddleware, removeFavoriteRecipe);

// ✅ Get User Profile
router.get("/profile", authMiddleware, getUserProfile);

export default router;



