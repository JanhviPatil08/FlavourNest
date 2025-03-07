import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Function to generate JWT token
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

    const token = generateToken(user._id);
    user.token = token;
    await user.save(); // ✅ Store the latest token in the database

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
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

    const token = generateToken(user._id);
    user.token = token; // ✅ Store the latest token in the database
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
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
    res.status(500).json({ message: "❌ Error fetching user profile" });
  }
};

// ✅ Logout User (Clear Token from DB)
export const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.token = null; // ✅ Remove token from the database
      await user.save();
    }
    res.json({ message: "✅ Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "❌ Logout failed" });
  }
};

