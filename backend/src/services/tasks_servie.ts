import Task, { ITask } from "../models/tasks";

export const createTaskService = async (taskData: Partial<ITask>) => {
  const task = new Task(taskData);
  return await task.save();
};

export const getAllTasksService = async () => {
  // Populates the assigned user details so the frontend can display their name
  return await Task.find()
    .populate("assignedTo", "name jobTitle")
    .populate("createdBy", "name");
};

export const getTasksByUserService = async (userId: string) => {
  return await Task.find({ assignedTo: userId }).populate(
    "assignedTo",
    "name jobTitle",
  );
};

export const updateTaskService = async (
  taskId: string,
  updateData: Partial<ITask>,
) => {
  return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
};
