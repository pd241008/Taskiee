import { Response } from "express";

import { AuthRequest } from "../middleware/auth_middleware";
import {
  createTaskService,
  getAllTasksService,
  getTasksByUserService,
  updateTaskStatusService,
  // 2. Fixed the typo in the service name (assuming you leave the filename as tasks_servie.ts)
} from "../services/tasks_servie";
// 3. Ensure the model import matches your file name exactly
import Task from "../models/tasks";

export const createTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Automatically set the creator to the admin making the request
    const taskData = { ...req.body, createdBy: req.user._id };
    const newTask = await createTaskService(taskData);
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Admins see all tasks, regular users only see their own
    if (req.user.accessLevel === "ADMIN") {
      const tasks = await getAllTasksService();
      res.status(200).json(tasks);
    } else {
      const tasks = await getTasksByUserService(req.user._id);
      res.status(200).json(tasks);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTaskStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // 1. Force TypeScript to treat 'id' strictly as a single string
    const id = req.params.id as string;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    // Security check: Only the assigned user or an admin can update the status
    if (
      task.assignedTo.toString() !== req.user._id.toString() &&
      req.user.accessLevel !== "ADMIN"
    ) {
      res
        .status(403)
        .json({ error: "Forbidden: You can only update your own tasks" });
      return;
    }

    // 2. Now TypeScript knows 'id' is a string, so this will pass perfectly!
    const updatedTask = await updateTaskStatusService(id, status);
    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
