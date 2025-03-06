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

  const { title, description, time, ingredients, steps } = req.body;

  // ✅ Ensure `ingredients` and `steps` are arrays
  const parsedIngredients = Array.isArray(ingredients) ? ingredients : ingredients.split(",");
  const parsedSteps = Array.isArray(steps) ? steps : steps.split(".");

  // ✅ Check for missing fields
  if (!title || !description || !time || !parsedIngredients.length || !parsedSteps.length || !req.file) {
    console.log("❌ Missing Fields:", { title, description, time, ingredients, steps, imageUrl });
    return res.status(400).json({ message: "All fields, including an image, are required" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const newRecipe = new Recipe({
      title,
      description,
      time,
      ingredients: parsedIngredients,
      steps: parsedSteps,
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




