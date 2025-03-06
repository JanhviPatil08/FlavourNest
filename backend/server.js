import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/loginRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix CORS Policy (Allow frontend requests)
app.use(
  cors({
    origin: ["https://flavournest-1.onrender.com", "http://localhost:3000"], // Allow frontend & local dev
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed request methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Ensure form-data works

// ✅ Test Route to Check If Backend Is Running
app.get("/", (req, res) => {
  res.send("🚀 FOODGRAM API is running...");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// ✅ MongoDB Connection
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
