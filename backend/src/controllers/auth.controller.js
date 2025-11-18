import { database } from "../../db/db.js";
import {
  assignTokens,
  verifyRefreshToken,
  revokeRefreshToken
} from "../services/token.service.js";

const User = database.User;

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "normal" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, password, role });

    const { accessToken, refreshToken } = await assignTokens(newUser);

    return res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.validPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = await assignTokens(user);

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// REFRESH TOKEN 
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body; // or cookies

    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token missing" });

    const user = await verifyRefreshToken(refreshToken);

    const { accessToken } = await assignTokens(user);

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
    });

  } catch (err) {
    return res.status(403).json({ message: err.message });
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  try {
    await revokeRefreshToken(req.user.id);

    return res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Profile fetched successfully",
      user: req.user, // Comes from verifyJWT middleware
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
