import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// ✅ Save (Like) or Remove Recipe
export const saveRecipe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  const { recipeId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.savedRecipes.includes(recipeId)) {
      user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipeId);
      await user.save();
      return res.json({ message: "Recipe removed from favorites", savedRecipes: user.savedRecipes });
    }

    user.savedRecipes.push(recipeId);
    await user.save();
    res.json({ message: "Recipe added to favorites", savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ✅ Get User's Favorite Recipes
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedRecipes.map(recipe => ({
      _id: recipe._id,
      title: recipe.title,
      description: recipe.description,
      cookingTime: recipe.cookingTime,
      imageUrl: recipe.imageUrl, // ✅ Ensure image URL is included
      ingredients: recipe.ingredients,
      instructions: recipe.instructions
    })));
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
