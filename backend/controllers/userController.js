import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// ✅ Add or Remove Favorite Recipe
export const toggleFavouriteRecipe = async (req, res) => {  // ✅ Ensure correct function name
  try {
    const { recipeId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipeExists = await Recipe.findById(recipeId);
    if (!recipeExists) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // ✅ Toggle favorite (add/remove)
    const index = user.savedRecipes.indexOf(recipeId);
    if (index === -1) {
      user.savedRecipes.push(recipeId);  // ✅ Add to favorites
    } else {
      user.savedRecipes.splice(index, 1);  // ✅ Remove from favorites
    }
    

    await user.save();
    res.json({ message: "✅ Favorite list updated", savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to update favorites", error: error.message });
  }
};

// ✅ Fetch User's Favorite Recipes
export const getFavouriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes");  // ✅ Fetch full recipe details
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.savedRecipes);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch favorite recipes" });
  }
};


// ✅ FIXED: Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // ✅ Changed `UserModel` to `User`
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({_id: user._id,
      name: user.name,
      email: user.email,
      favoriteRecipes: user.savedRecipes, });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
