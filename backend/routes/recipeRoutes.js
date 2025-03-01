import express from "express";
import { getRecipes, createRecipe } from "../controllers/recipeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" }); // ✅ Ensure `uploads/` exists in the backend
const router = express.Router();

// ✅ Get All Recipes (No authentication needed)
router.get("/", getRecipes);

// ✅ Create Recipe (Requires Authentication & Image Upload)
router.post("/", authMiddleware, upload.single("image"), createRecipe);

export default router;


