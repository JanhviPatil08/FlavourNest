import Recipe from "../models/Recipe.js";

export const createRecipe = async (req, res) => {
  try {
    console.log("📌 Received Recipe Data:", req.body);
    console.log("📌 User ID from Token:", req.user?.id);
    console.log("📌 Uploaded Image:", req.file);

    const { title, description, cookingTime, ingredients, instructions } = req.body;

    if (!req.user?.id) {
      console.error("❌ User ID not found. Ensure authMiddleware is working.");
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!req.file) {
      console.error("❌ No image uploaded.");
      return res.status(400).json({ message: "Image is required." });
    }

    if (!title || !description || !cookingTime || !ingredients || !instructions) {
      console.error("❌ Missing required fields.");
      return res.status(400).json({ message: "All fields are required." });
    }

    const newRecipe = new Recipe({
      title,
      description,
      cookingTime: Number(cookingTime),
      ingredients: JSON.parse(ingredients), // Ensure ingredients is an array
      instructions: JSON.parse(instructions), // Ensure instructions is an array
      imageUrl: `/uploads/${req.file.filename}`,
      createdBy: req.user.id,
    });

    await newRecipe.save();
    console.log("✅ Recipe Created Successfully:", newRecipe);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("❌ Recipe Creation Error:", error);
    res.status(500).json({ message: "Failed to create recipe.", error: error.message });
  }
};
