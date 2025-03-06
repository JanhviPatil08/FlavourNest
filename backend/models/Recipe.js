import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  ingredients: { type: [String], required: true }, // ✅ Store as an array of strings
  instructions: { type: [String], required: true }, // ✅ Store as an array of strings
  imageUrl: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Recipe", RecipeSchema);

