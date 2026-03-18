export type TaskStatus =
  | "Pending"
  | "Backlog"
  | "Todo"
  | "In Progress"
  | "In Review"
  | "Blocked"
  | "Done";

export interface User {
  _id: string;
  name: string;
  jobTitle: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: User | null;
  createdAt: string;
}
