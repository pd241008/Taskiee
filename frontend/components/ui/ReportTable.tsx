import React from "react";
import { Task } from "../../types/tasks";

interface ReportTableProps {
  tasks: any[];
}

export const ReportTable = ({ tasks }: ReportTableProps) => {
  return (
    <div className="w-full overflow-x-auto border-2 border-white shadow-neo-white bg-neo-card mt-8">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-white bg-neo-purple text-black font-black uppercase tracking-wider">
            <th className="p-4 border-r-2 border-white">Task Title</th>
            <th className="p-4 border-r-2 border-white">Project</th>
            <th className="p-4 border-r-2 border-white">Status</th>
            <th className="p-4 border-r-2 border-white">Priority</th>
            <th className="p-4 border-r-2 border-white">Assigned To</th>
            <th className="p-4">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => (
            <tr key={task._id} className="border-b-2 border-gray-800 hover:bg-white/5 transition-colors font-mono text-sm">
              <td className="p-4 border-r-2 border-gray-800 font-bold text-neo-cyan">{task.title}</td>
              <td className="p-4 border-r-2 border-gray-800">{task.project?.name || "N/A"}</td>
              <td className="p-4 border-r-2 border-gray-800">
                <span className={`px-2 py-1 border-2 border-white text-xs font-black uppercase ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="p-4 border-r-2 border-gray-800">
                <span className={`px-2 py-1 border-2 border-white text-xs font-black uppercase ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
              <td className="p-4 border-r-2 border-gray-800">{task.assignedTo?.name || "Unassigned"}</td>
              <td className="p-4">{task.deadline ? new Date(task.deadline).toLocaleDateString() : "No Date"}</td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={6} className="p-10 text-center text-gray-500 font-bold italic">
                No tasks found matching current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Done": return "bg-neo-green text-black";
    case "In Progress": return "bg-neo-yellow text-black";
    case "Blocked": return "bg-neo-pink text-black";
    default: return "bg-gray-700 text-white";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-neo-pink text-black";
    case "Medium": return "bg-neo-cyan text-black";
    case "Low": return "bg-neo-green text-black";
    default: return "bg-gray-700 text-white";
  }
};
