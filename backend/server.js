import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/loginRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config(); // ✅ Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Test Route to Check If Backend Is Running
app.get("/", (req, res) => {
  res.send("🚀 FOODGRAM API is running...");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/uploads", express.static("uploads")); // ✅ Serve uploaded images


// ✅ MongoDB Connection (Deprecated options removed)
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MongoDB URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


