import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/loginRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // ✅ Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Ensure `uploads/` directory exists
const uploadDir = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Fix CORS Issue - Allow frontend requests
app.use(
  cors({
    origin: "https://flavournest-1.onrender.com", // Allow frontend domain
    credentials: true, // Allow authentication headers
  })
);

// ✅ Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// ✅ Serve uploaded images
app.use("/uploads", express.static(uploadDir));

// ✅ Test Route to Check If Backend Is Running
app.get("/", (req, res) => {
  res.send("🚀 FOODGRAM API is running...");
});

// ✅ API Routes
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MongoDB URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`✅ MongoDB Connected Successfully`))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
