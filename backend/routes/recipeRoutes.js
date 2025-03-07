import express from "express";
import { getRecipes, createRecipe } from "../controllers/recipeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get All Recipes (Public)
router.get("/", getRecipes);

// ✅ Create Recipe (Requires Authentication)
router.post("/", authMiddleware, createRecipe);

export default router;
