import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  console.log("📌 Headers Received:", req.headers);
  let token = req.header("Authorization");

  if (!token) {
    console.log("❌ No token received"); // ✅ Debugging log
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; // ✅ Remove "Bearer " prefix
    }

    console.log("📌 Extracted Token:", token); // ✅ Debugging log

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    console.log("✅ User Verified:", req.user); // ✅ Debugging log
    next();
  } catch (error) {
    console.log("❌ Invalid Token:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;

