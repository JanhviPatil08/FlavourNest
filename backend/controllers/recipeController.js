import Recipe from "../models/Recipe.js";

// ✅ Create a New Recipe (With Image Upload)
export const createRecipe = async (req, res) => {
  try {
    console.log("📌 Received Recipe Data:", req.body);
    console.log("📌 User ID from Token:", req.user?.id);
    console.log("📌 Uploaded Image:", req.file?.filename);

    // ✅ Extract form data
    const { title, description, cookingTime, ingredients, instructions } = req.body;

    // ✅ Check authentication
    if (!req.user?.id) {
      console.error("❌ Unauthorized request. No user ID found.");
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // ✅ Ensure required fields are present
    if (!title || !description || !cookingTime || !ingredients || !instructions || !req.file) {
      console.log("❌ Missing Fields:", { title, description, cookingTime, ingredients, instructions, image: req.file?.filename });
      return res.status(400).json({ message: "All fields, including an image, are required." });
    }

    // ✅ Convert `ingredients` & `instructions` to array safely
    let parsedIngredients, parsedInstructions;
    try {
      parsedIngredients = typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
      parsedInstructions = typeof instructions === "string" ? JSON.parse(instructions) : instructions;
    } catch (err) {
      console.error("❌ Error parsing JSON fields:", err);
      return res.status(400).json({ message: "Invalid format for ingredients or instructions." });
    }

    // ✅ Validate ingredients & instructions are arrays
    if (!Array.isArray(parsedIngredients) || !Array.isArray(parsedInstructions)) {
      console.error("❌ Ingredients or Instructions are not arrays.");
      return res.status(400).json({ message: "Ingredients and Instructions must be arrays." });
    }

    // ✅ Ensure cookingTime is a valid number
    const parsedCookingTime = Number(cookingTime);
    if (isNaN(parsedCookingTime) || parsedCookingTime <= 0) {
      return res.status(400).json({ message: "Invalid cooking time. Must be a positive number." });
    }

    // ✅ Create a new recipe
    const newRecipe = new Recipe({
      title,
      description,
      cookingTime: parsedCookingTime,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      imageUrl: `/uploads/${req.file.filename}`,
      createdBy: req.user.id,
    });

    await newRecipe.save();
    console.log("✅ Recipe Created Successfully:", newRecipe);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("❌ Recipe Creation Error:", error.message);
    res.status(500).json({ message: "Failed to create recipe.", error: error.message });
  }
};

// ✅ Get All Recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    console.log("✅ Fetched Recipes:", recipes.length);
    res.json(recipes);
  } catch (error) {
    console.error("❌ Error Fetching Recipes:", error.message);
    res.status(500).json({ message: "Failed to fetch recipes." });
  }
};
