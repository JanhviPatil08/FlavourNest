import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],  // List of saved recipes
}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export default User;


