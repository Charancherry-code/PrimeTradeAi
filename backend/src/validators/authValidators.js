const { z } = require("zod");

const sanitize = (value) => value.replace(/[<>$]/g, "");

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).transform(sanitize),
    email: z.string().trim().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be less than 72 characters")
      .regex(/[A-Z]/, "Password must include one uppercase letter (A-Z)")
      .regex(/[a-z]/, "Password must include one lowercase letter (a-z)")
      .regex(/\d/, "Password must include one number (0-9)"),
  }),
  params: z.object({}),
  query: z.object({}),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(8).max(72),
  }),
  params: z.object({}),
  query: z.object({}),
});

module.exports = {
  registerSchema,
  loginSchema,
};
