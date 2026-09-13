import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { logActivity } from "../utils/logActivity.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters.",
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email already registered.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  await logActivity({
    userId: user._id,
    action: "REGISTER",
    entityType: "User",
    entityId: user._id,
    details: "User account created",
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: "Your account has been blocked.",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  await logActivity({
    userId: user._id,
    action: "LOGIN",
    entityType: "User",
    entityId: user._id,
  });

  const token = generateToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive,
      createdAt: req.user.createdAt,
    },
  });
};

export const updateProfile = async (req, res) => {
  const { name } = req.body;

  if (name) req.user.name = name.trim();

  await req.user.save();

  await logActivity({
    userId: req.user._id,
    action: "PROFILE_UPDATED",
    entityType: "User",
    entityId: req.user._id,
  });

  res.json({
    success: true,
    message: "Profile updated.",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required.",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters.",
    });
  }

  const user = await User.findById(req.user._id).select("+password");
  const validPassword = await bcrypt.compare(currentPassword, user.password);

  if (!validPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect.",
    });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  await logActivity({
    userId: user._id,
    action: "PASSWORD_CHANGED",
    entityType: "User",
    entityId: user._id,
  });

  res.json({
    success: true,
    message: "Password changed successfully.",
  });
};
