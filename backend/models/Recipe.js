import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  cookingTime: { type: Number, required: true },
  imageUrl: { type: String, required: true }, // ✅ Ensure imageUrl is required
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Link to user
});

const RecipeModel = mongoose.model("Recipe", RecipeSchema);
export default RecipeModel;

