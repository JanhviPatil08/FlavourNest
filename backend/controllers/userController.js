import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// ✅ Save (Like) or Remove Recipe
export const toogleFavouriteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.savedRecipes.indexOf(recipeId);
    if (index === -1) {
      user.savedRecipes.push(recipeId);  // ✅ Add recipe to favorites
    } else {
      user.savedRecipes.splice(index, 1);  // ✅ Remove recipe from favorites
    }

    await user.save();
    res.json({ message: "✅ Favorite list updated", savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to update favorites" });
  }
};

// ✅ Get User's Favorite Recipes
export const getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes");
    if (!user)
      { return res.status(404).json({ message: "User not found" });
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
