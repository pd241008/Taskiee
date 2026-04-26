import React from "react";
import { Task } from "../../types/tasks";

interface ReportTableProps {
  tasks: any[];
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Done": return { backgroundColor: '#A3E635', color: 'black' };
    case "In Progress": return { backgroundColor: '#FACC15', color: 'black' };
    case "Blocked": return { backgroundColor: '#EC4899', color: 'black' };
    default: return { backgroundColor: '#374151', color: 'white' };
  }
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case "High": return { backgroundColor: '#EC4899', color: 'black' };
    case "Medium": return { backgroundColor: '#22D3EE', color: 'black' };
    case "Low": return { backgroundColor: '#A3E635', color: 'black' };
    default: return { backgroundColor: '#374151', color: 'white' };
  }
};

export const ReportTable = ({ tasks }: ReportTableProps) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', border: '2px solid white', backgroundColor: '#151518' }} className="shadow-neo-white mt-8">
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid white', backgroundColor: '#A855F7', color: 'black' }} className="font-black uppercase tracking-wider">
            <th style={{ padding: '1rem', borderRight: '2px solid white' }}>Task Title</th>
            <th style={{ padding: '1rem', borderRight: '2px solid white' }}>Project</th>
            <th style={{ padding: '1rem', borderRight: '2px solid white' }}>Status</th>
            <th style={{ padding: '1rem', borderRight: '2px solid white' }}>Priority</th>
            <th style={{ padding: '1rem', borderRight: '2px solid white' }}>Assigned To</th>
            <th style={{ padding: '1rem' }}>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => (
            <tr key={task._id} style={{ borderBottom: '2px solid #1f2937' }} className="font-mono text-sm">
              <td style={{ padding: '1rem', borderRight: '2px solid #1f2937', color: '#22D3EE', fontWeight: 'bold' }}>{task.title}</td>
              <td style={{ padding: '1rem', borderRight: '2px solid #1f2937', color: 'white' }}>{task.project?.name || "N/A"}</td>
              <td style={{ padding: '1rem', borderRight: '2px solid #1f2937' }}>
                <span style={{ ...getStatusStyle(task.status), padding: '0.25rem 0.5rem', border: '2px solid white', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase' }}>
                  {task.status}
                </span>
              </td>
              <td style={{ padding: '1rem', borderRight: '2px solid #1f2937' }}>
                <span style={{ ...getPriorityStyle(task.priority), padding: '0.25rem 0.5rem', border: '2px solid white', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase' }}>
                  {task.priority}
                </span>
              </td>
              <td style={{ padding: '1rem', borderRight: '2px solid #1f2937', color: 'white' }}>{task.assignedTo?.name || "Unassigned"}</td>
              <td style={{ padding: '1rem', color: 'white' }}>{task.deadline ? new Date(task.deadline).toLocaleDateString() : "No Date"}</td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#6b7280', fontWeight: 'bold', fontStyle: 'italic' }}>
                No tasks found matching current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
