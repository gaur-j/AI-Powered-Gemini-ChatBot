import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register a new user
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All Fields are Required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await new User({
      username,
      email,
      password: hashed,
    }).save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        personality: newUser.personality || null,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error); // ✅ Log the error!
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Login a User
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "user not found" });
  const vaild = bcrypt.compare(password, user.password);
  if (!vaild) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      personality: user.personality || null,
    },
  });
};
