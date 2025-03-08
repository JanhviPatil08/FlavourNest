import express from "express";
import { getRecipes, createRecipe,getUserRecipes } from "../controllers/recipeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get All Recipes (Public)
router.get("/", getRecipes);
router.get("/user-recipes", authMiddleware, getUserRecipes);
// ✅ Create Recipe (Requires Authentication)
router.post("/", authMiddleware, createRecipe);

router.get("/:id", async (req, res) => {
    try {
      const recipe = await RecipeModel.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

export default router;
