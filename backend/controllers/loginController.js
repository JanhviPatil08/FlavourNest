import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

// ✅ Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "❌ User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "✅ Registration successful! Please login." });
  } catch (error) {
    res.status(500).json({ message: "❌ Registration failed" });
  }
};

// ✅ Login User (Store Token in DB)
 const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    let token = user.token;
    if (!token) {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);  // 🔥 No expiry
      user.token = token;
      await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // ✅ Send token in response
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Login failed" });
  }
};

// ✅ Logout User (Clear Token from DB)
const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.token = null; // ✅ Clear token from DB
    await user.save();
    res.json({ message: "✅ Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "❌ Logout failed" });
  }
};
// ✅ Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -token"); // Exclude password and token
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to get user profile" });
  }
};

const loginController = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
};

export default loginController;
