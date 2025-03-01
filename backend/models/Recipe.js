import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  instructions: String,
  imageUrl: String,
  cookingTime: Number,
  userOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

export default Recipe; 
