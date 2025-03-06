import express from "express";
import { getRecipes, createRecipe } from "../controllers/recipeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import fs from "fs";

// ✅ Ensure `uploads/` directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer Storage Configuration (Stores file with original name)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

// ✅ Get All Recipes (No authentication needed)
router.get("/", getRecipes);

// ✅ Create Recipe (Requires Authentication & Image Upload)
router.post("/", authMiddleware, upload.single("image"), createRecipe);

export default router;



