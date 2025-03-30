import mongoose from "mongoose";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// ✅ Add or Remove Favorite Recipe (More Efficient)
export const toggleFavouriteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id;

    console.log("🟡 Request to toggle favorite:", { userId, recipeId });

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      console.log("🔴 Invalid recipe ID");
      return res.status(400).json({ message: "Invalid recipe ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("🔴 User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      console.log("🔴 Recipe not found");
      return res.status(404).json({ message: "Recipe not found" });
    }

    // ✅ Convert recipeId to ObjectId & Toggle Favorite
    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
    const isFavorite = user.savedRecipes.some((id) => id.equals(recipeObjectId));

    const updateAction = isFavorite
      ? { $pull: { savedRecipes: recipeObjectId } } // Remove from favorites
      : { $addToSet: { savedRecipes: recipeObjectId } }; // Add to favorites

    const updatedUser = await User.findByIdAndUpdate(userId, updateAction, { new: true }).populate("savedRecipes");

    console.log("✅ Updated savedRecipes:", updatedUser.savedRecipes);

    res.json({ message: "✅ Favorite list updated", favorites: updatedUser.savedRecipes });
  } catch (error) {
    console.error("❌ Failed to update favorites:", error);
    res.status(500).json({ message: "Failed to update favorites", error: error.message });
  }
};

// ✅ Fetch User's Favorite Recipes
export const getFavouriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🟢 Fetching favorite recipes:", user.savedRecipes);

    res.json({ favorites: user.savedRecipes }); // ✅ Ensure response format is correct
  } catch (error) {
    console.error("❌ Failed to fetch favorite recipes:", error);
    res.status(500).json({ message: "Failed to fetch favorite recipes" });
  }
};

// ✅ Get User Profile with Favorites
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes").select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🟢 User profile fetched:", user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      favorites: user.savedRecipes, // ✅ Ensure frontend receives full recipe details
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};




