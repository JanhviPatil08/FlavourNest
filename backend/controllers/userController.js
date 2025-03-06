import User from "../models/User.js";

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

// ✅ Get User's Saved Recipes
export const getSavedRecipes = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedRecipes",
      select: "title description", // ✅ Select only needed fields
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.savedRecipes);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ✅ Get User's Favorite Recipes (Fix for your error)
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes");
    res.json(user.savedRecipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};