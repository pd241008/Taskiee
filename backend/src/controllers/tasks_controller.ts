import { Response } from "express";

import { AuthRequest } from "../middleware/auth_middleware";
import {
  createTaskService,
  getAllTasksService,
  getTasksByUserService,
  updateTaskService,
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

export const updateTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, reviewNotes } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const isAdmin = req.user.accessLevel === "ADMIN";

    // 1. Permission check for general updates (status)
    if (
      task.assignedTo.toString() !== req.user._id.toString() &&
      !isAdmin
    ) {
      res
        .status(403)
        .json({ error: "Forbidden: You do not have permission to update this task" });
      return;
    }

    // 2. Permission check for reviewNotes (only Admin)
    if (reviewNotes !== undefined && !isAdmin) {
      res.status(403).json({ error: "Forbidden: Only admins can add reviews" });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes;

    const updatedTask = await updateTaskService(id, updateData);
    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
