import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, default: null },
    savedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ], // Ensuring it correctly references Recipe model
  },
  { timestamps: true }
);

// ✅ Ensure virtual population (optional but useful)
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);
export default User;
