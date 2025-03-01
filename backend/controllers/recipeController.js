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
  console.log("📌 User ID from Token:", req.user?._id);
  console.log("📌 Uploaded Image:", req.file); // ✅ Debugging log

  const { title, description, time, ingredients, steps } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !description || !time || !ingredients || !steps || !imageUrl) {
    console.log("❌ Missing Fields:", { title, description, time, ingredients, steps, imageUrl });
    return res.status(400).json({ message: "All fields including an image are required" });
  }

  try {
    const newRecipe = new Recipe({
      title,
      description,
      time,
      ingredients,
      steps,
      imageUrl,
      createdBy: req.user._id, // Ensure `protect` middleware attaches user
    });

    await newRecipe.save();
    console.log("✅ Recipe Created Successfully:", newRecipe);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("❌ Recipe Creation Error:", error);
    res.status(500).json({ message: "Failed to create recipe." });
  }
};



