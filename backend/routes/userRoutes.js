import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { saveRecipe, getSavedRecipes, getUserProfile } from "../controllers/userController.js";

const router = express.Router();

// ✅ Save (Like) or Remove Recipe
router.post("/save-recipe", authMiddleware, saveRecipe);

// ✅ Get User's Saved Recipes
router.get("/saved-recipes", authMiddleware, getSavedRecipes);

// ✅ Get User Profile
router.get("/profile", authMiddleware, getUserProfile);

export default router;


