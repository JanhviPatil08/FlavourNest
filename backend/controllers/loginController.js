import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ✅ Register User
export const registerUser = async (req, res) => {
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

    const token = generateToken(user._id); // ✅ Generate Token
    console.log("Generated Token (Register):", token); // ✅ Debugging

    res.status(201).json({
      message: "🎉 Registration successful! Please login.",
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // ✅ Send token
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "❌ Registration failed" });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    const token = generateToken(user._id); // ✅ Generate Token
    console.log("Generated Token (Login):", token); // ✅ Debugging

    res.status(200).json({
      message: "✅ Login successful!",
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // ✅ Send token
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "❌ Login failed" });
  }
};

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "❌ Error fetching profile" });
  }
};

// ✅ Logout User (Handled on Frontend)
export const logoutUser = async (req, res) => {
  res.status(200).json({ message: "✅ Logout successful" });
};
