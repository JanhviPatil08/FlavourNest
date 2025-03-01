import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ✅ Register User
export const registerUser = async (req, res) => {
  console.log("📌 Received Data:", req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("❌ Missing fields:", { name, email, password }); // ✅ Debug log
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ User already exists!");
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    console.log("✅ User registered successfully:", user); // ✅ Debug log before sending response

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  console.log("📌 Request Headers:", req.headers); 
  console.log("📌 Login Data Received:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("❌ Missing Fields:", { email, password }); // ✅ Debugging log
    return res.status(400).json({ message: "All fields are required" });
    }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Invalid email!");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password!");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ User logged in successfully:", user.name);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token:generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};



