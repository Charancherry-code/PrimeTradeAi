const errorHandler = (err, _req, res, _next) => {
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Resource already exists",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
