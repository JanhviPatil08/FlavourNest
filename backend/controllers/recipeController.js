import Recipe from "../models/Recipe.js";

// ✅ Get All Recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    console.log("✅ Fetched Recipes:", recipes.length);
    res.json(recipes);
  } catch (error) {
    console.error("❌ Error Fetching Recipes:", error);
    res.status(500).json({ message: "Failed to fetch recipes." });
  }
};

// ✅ Create a New Recipe (With Image Upload)
export const createRecipe = async (req, res) => {
  console.log("📌 Received Recipe Data:", req.body);
  console.log("📌 User ID from Token:", req.user?.id);
  console.log("📌 Uploaded Image:", req.file);

  const { title, description, cookingTime, ingredients, instructions } = req.body;

  // ✅ Ensure required fields are present
  if (!title || !description || !cookingTime || !ingredients || !instructions || !req.file) {
    console.log("❌ Missing Fields:", { title, description, cookingTime, ingredients, instructions, image: req.file?.filename });
    return res.status(400).json({ message: "All fields, including an image, are required." });
  }

  // ✅ Parse `ingredients` & `instructions` to arrays if needed
  let parsedIngredients, parsedInstructions;
  try {
    parsedIngredients = typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
    parsedInstructions = typeof instructions === "string" ? JSON.parse(instructions) : instructions;
  } catch (err) {
    console.log("❌ Error parsing ingredients/instructions:", err);
    return res.status(400).json({ message: "Invalid ingredients or instructions format." });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const newRecipe = new Recipe({
      title,
      description,
      cookingTime: Number(cookingTime),
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      imageUrl,
      createdBy: req.user.id, // ✅ Ensure `authMiddleware` sets `id`
    });

    await newRecipe.save();
    console.log("✅ Recipe Created Successfully:", newRecipe);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("❌ Recipe Creation Error:", error);
    res.status(500).json({ message: "Failed to create recipe." });
  }
};




