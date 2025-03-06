import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { saveRecipe, getSavedRecipes, getUserProfile } from "../controllers/userController.js";

const router = express.Router();

// ✅ Favorites Routes (Fix)
router.post("/favorites", authMiddleware, saveRecipe);
router.get("/favorites", authMiddleware, getSavedRecipes);
router.get("/profile", authMiddleware, getUserProfile);

export default router;





