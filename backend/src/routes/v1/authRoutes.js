const express = require("express");
const validate = require("../../middlewares/validate");
const { authenticate } = require("../../middlewares/auth");
const { register, login, me } = require("../../controllers/authController");
const { registerSchema, loginSchema } = require("../../validators/authValidators");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);

module.exports = router;
