const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const buildScope = (user) => (user.role === "admin" ? {} : { owner: user._id });

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Task created",
    data: task,
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find(buildScope(req.user))
    .populate("owner", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    ...buildScope(req.user),
  }).populate("owner", "name email role");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, ...buildScope(req.user) },
    req.body,
    { new: true, runValidators: true }
  ).populate("owner", "name email role");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json({
    success: true,
    message: "Task updated",
    data: task,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    ...buildScope(req.user),
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json({
    success: true,
    message: "Task deleted",
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
