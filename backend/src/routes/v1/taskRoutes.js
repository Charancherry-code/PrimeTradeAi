const express = require("express");
const { authenticate, authorize } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../../controllers/taskController");
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} = require("../../validators/taskValidators");

const router = express.Router();

router.use(authenticate);

router.post("/", validate(createTaskSchema), createTask);
router.get("/", getTasks);
router.get("/:id", validate(taskIdSchema), getTaskById);
router.patch("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", validate(taskIdSchema), authorize("admin", "user"), deleteTask);

module.exports = router;
