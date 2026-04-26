import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  deadline?: Date;
  status:
  | "Pending"
  | "Backlog"
  | "Todo"
  | "In Progress"
  | "In Review"
  | "Blocked"
  | "Done";
  priority: "Low" | "Medium" | "High";
  projectId?: mongoose.Types.ObjectId;
  reviewNotes?: string;
}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deadline: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Backlog",
        "Todo",
        "In Progress",
        "In Review",
        "Blocked",
        "Done",
      ],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
    reviewNotes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITask>("Task", TaskSchema);
