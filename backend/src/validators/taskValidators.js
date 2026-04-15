const { z } = require("zod");

const sanitize = (value) => value.replace(/[<>$]/g, "");

const taskBody = z.object({
  title: z.string().trim().min(2).max(120).transform(sanitize),
  description: z.string().trim().max(1000).transform(sanitize).optional().default(""),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
});

const createTaskSchema = z.object({
  body: taskBody,
  params: z.object({}),
  query: z.object({}),
});

const updateTaskSchema = z.object({
  body: taskBody.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid task id"),
  }),
  query: z.object({}),
});

const taskIdSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid task id"),
  }),
  query: z.object({}),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
};
