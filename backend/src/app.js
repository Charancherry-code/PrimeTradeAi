const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { swaggerUi, swaggerSpec } = require("./config/swagger");
const authRoutes = require("./routes/v1/authRoutes");
const taskRoutes = require("./routes/v1/taskRoutes");
const ApiError = require("./utils/ApiError");
const errorHandler = require("./middlewares/errorHandler");
const sanitizeInput = require("./middlewares/sanitizeInput");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [process.env.FRONTEND_ORIGIN || "http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5500"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(sanitizeInput);
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use(errorHandler);

module.exports = app;
