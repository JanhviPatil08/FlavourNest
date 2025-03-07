import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    console.log("Received Token:", token); // ✅ Debugging

    // ✅ Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find User & Attach to `req.user`
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    next(); // ✅ Proceed to next middleware
  } catch (error) {
    console.error("JWT Authentication Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "❌ Token expired, please login again" });
    }
    return res.status(401).json({ message: "❌ Invalid token" });
  }
};

export default authMiddleware;


