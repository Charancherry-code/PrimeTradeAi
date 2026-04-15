const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });

const attachAuthCookie = (res, token) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });
};

const buildAuthPayload = (user, token) => {
  const data = {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };

  // Avoid exposing JWT in response bodies in production.
  if (process.env.NODE_ENV !== "production") {
    data.token = token;
  }

  return data;
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hash,
    role: "user",
  });

  const token = signToken(user);
  attachAuthCookie(res, token);
  res.status(201).json({
    success: true,
    message: "User registered",
    data: buildAuthPayload(user, token),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken(user);
  attachAuthCookie(res, token);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: buildAuthPayload(user, token),
  });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

module.exports = {
  register,
  login,
  me,
};
