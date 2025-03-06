import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// ✅ Save (Like) a Recipe
export const saveFavoriteRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ message: "Recipe ID is required" });

    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
    }

    res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get User's Favorite Recipes
export const getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove a Recipe from Favorites
export const removeFavoriteRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = user.favorites.filter((fav) => fav.toString() !== req.params.id);
    await user.save();

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

