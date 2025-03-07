import jwt from "jsonwebtoken";
import UserModel from "../models/User.js"; // Ensure correct path

 const authMiddleware = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1]; // Get the token part
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await UserModel.findById(decoded.id).select("-password"); // Attach user info
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

export default authMiddleware;

