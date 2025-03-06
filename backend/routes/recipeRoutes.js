import express from "express";
import { getRecipes, createRecipe } from "../controllers/recipeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import fs from "fs";

const uploadDir = "public/uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // ✅ Ensure all parent folders exist
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

// ✅ Get All Recipes (No authentication needed)
router.get("/", getRecipes);

// ✅ Create Recipe (Requires Authentication & Image Upload)
router.post("/", authMiddleware, upload.single("image"), createRecipe);

export default router;
