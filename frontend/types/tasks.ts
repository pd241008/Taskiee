export type TaskStatus =
  | "Pending"
  | "Backlog"
  | "Todo"
  | "In Progress"
  | "In Review"
  | "Blocked"
  | "Done";

export type UserRole = "PRESIDENT" | "ADMIN" | "USER";

export interface User {
  _id: string;
  name: string;
  jobTitle: string;
  accessLevel: UserRole;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "Low" | "Medium" | "High";
  projectId?: string;
  assignedTo: User | null;
  createdAt: string;
  deadline?: string;
  reviewNotes?: string;
}
