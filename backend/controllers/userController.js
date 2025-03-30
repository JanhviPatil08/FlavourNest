import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// ✅ Add or Remove Favorite Recipe
export const toggleFavouriteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id;

    console.log("🟡 Request to toggle favorite:", { userId, recipeId });

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

    // ✅ Toggle favorite (add/remove)
    if (user.savedRecipes.some((id) => id.toString() === recipeId)) {
      console.log("🟠 Removing recipe from favorites...");
      user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipeId);
    } else {
      console.log("🟢 Adding recipe to favorites...");
      user.savedRecipes.push(recipeId);
    }

    await user.save();

    console.log("✅ Updated savedRecipes:", user.savedRecipes);

    res.json({ message: "✅ Favorite list updated", favorites: user.savedRecipes });
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

    res.json({ favorites: user.savedRecipes }); // ✅ Returning full recipe details
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

