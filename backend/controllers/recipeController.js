import Recipe from "../models/Recipe.js";

// ✅ Create a New Recipe (With Image URL instead of file upload)
export const createRecipe = async (req, res) => {
  try {
    console.log("📌 Received Recipe Data:", req.body);
    console.log("📌 User ID from Token:", req.user?.id);

    const { title, description, cookingTime, ingredients, instructions, imageUrl } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!title || !description || !cookingTime || !ingredients || !instructions || !imageUrl) {
      return res.status(400).json({ message: "All fields, including an image URL, are required." });
    }

    const parsedIngredients = Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients);
    const parsedInstructions = Array.isArray(instructions) ? instructions : JSON.parse(instructions);

    if (!Array.isArray(parsedIngredients) || !Array.isArray(parsedInstructions)) {
      return res.status(400).json({ message: "Ingredients and Instructions must be arrays." });
    }

    const parsedCookingTime = Number(cookingTime);
    if (isNaN(parsedCookingTime) || parsedCookingTime <= 0) {
      return res.status(400).json({ message: "Invalid cooking time. Must be a positive number." });
    }

    const newRecipe = new Recipe({
      title,
      description,
      cookingTime: parsedCookingTime,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      imageUrl, // ✅ Store image URL instead of uploading files
      createdBy: req.user.id,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: "Failed to create recipe.", error: error.message });
  }
};

// ✅ Get All Recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes." });
  }
};

// ✅ Fetch Only Logged-in User's Recipes
export const getUserRecipes = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const recipes = await Recipe.find({ createdBy: req.user.id });  // ✅ Filter by logged-in user
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user recipes." });
  }
};

