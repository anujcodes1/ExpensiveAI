import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
};
