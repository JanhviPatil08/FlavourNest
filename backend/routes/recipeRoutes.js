import express from "express";
import { getRecipes, createRecipe } from "../controllers/recipeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/"; // 🔹 FIXED: Removed "public/" (Render doesn't serve from "public/uploads/")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // ✅ Ensure folder exists
}

// ✅ Multer Storage Configuration (Fix Image Saving)
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
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, ingredients, instructions, cookingTime } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required!" });
    }

    // 🔹 FIXED: Save only the filename, not the full path
    const imageUrl = req.file.filename;

    const newRecipe = await createRecipe({
      title,
      description,
      ingredients: JSON.parse(ingredients),
      instructions: JSON.parse(instructions),
      cookingTime,
      imageUrl, // ✅ Save only filename
    });

    res.status(201).json({ message: "Recipe added successfully!", recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ message: "Error adding recipe", error: error.message });
  }
});

export default router;
