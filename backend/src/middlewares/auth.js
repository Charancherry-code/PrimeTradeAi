const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, bearerToken] = authHeader.split(" ");
  const token = bearerToken || req.cookies?.access_token;

  if (!token || (bearerToken && scheme !== "Bearer")) {
    throw new ApiError(401, "Missing or invalid authorization token");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_error) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(payload.sub).select("-password");
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "Forbidden: insufficient role"));
  }
  return next();
};

module.exports = {
  authenticate,
  authorize,
};
