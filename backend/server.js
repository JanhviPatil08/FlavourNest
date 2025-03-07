import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/loginRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// ✅ Fix `__dirname` for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Ensure `uploads/` directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Fix CORS Issue - Allow frontend requests
app.use(cors({
  origin: "https://flavournest-1.onrender.com",
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images correctly (IMPORTANT FIX)
app.use("/uploads", express.static(uploadDir));

app.get("/", (req, res) => {
  res.send("🚀 FOODGRAM API is running...");
});

// ✅ API Routes
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));


// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MongoDB URI is missing in .env file");
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`✅ MongoDB Connected Successfully`))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
