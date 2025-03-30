import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// ✅ Add or Remove Favorite Recipe
export const toggleFavouriteRecipe = async (req, res) => {
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
    if (user.savedRecipes.includes(recipeId)) {
      user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipeId);
    } else {
      user.savedRecipes.push(recipeId);
    }

    await user.save();

    // ✅ Send updated favorites list
    res.json({ message: "✅ Favorite list updated", favorites: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to update favorites", error: error.message });
  }
};

// ✅ Fetch User's Favorite Recipes
export const getFavouriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Send back the favorites in correct format
    res.json({ favorites: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch favorite recipes" });
  }
};

// ✅ Get User Profile with Favorites
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes").select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Include favorites in response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      favorites: user.savedRecipes, // Ensuring it matches frontend expectations
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
