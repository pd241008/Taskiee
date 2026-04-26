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
    // Every task should be seen by everyone (Kanban visibility)
    const tasks = await getAllTasksService();
    res.status(200).json(tasks);
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
    const { status, reviewNotes, assignedTo } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const validStatuses = [
      "Pending",
      "Backlog",
      "Todo",
      "In Progress",
      "In Review",
      "Blocked",
      "Done",
    ];

    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}` });
      return;
    }

    const isAdminOrPresident = req.user.accessLevel === "ADMIN" || req.user.accessLevel === "PRESIDENT";

    // 1. Permission check for general updates (status)
    if (
      task.assignedTo.toString() !== req.user._id.toString() &&
      !isAdminOrPresident
    ) {
      res
        .status(403)
        .json({ error: "Forbidden: You do not have permission to update this task" });
      return;
    }

    // 2. Permission check for restricted fields (only Admin/President)
    const isReassigning = assignedTo !== undefined && assignedTo !== task.assignedTo.toString();
    const isReviewing = reviewNotes !== undefined && reviewNotes !== (task.reviewNotes || "");

    if ((isReassigning || isReviewing) && !isAdminOrPresident) {
      res.status(403).json({ error: "Forbidden: Only admins and presidents can reassign tasks or add reviews" });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const updatedTask = await updateTaskService(id, updateData);
    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
