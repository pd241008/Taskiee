"use client";

import { useState, FormEvent } from "react";

/* ================= TYPES ================= */

interface User {
  _id: string;
  name: string;
  jobTitle?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onTaskCreated: () => void;
  adminId: string;
  apiUrl: string;
}

/* ================= COMPONENT ================= */

export default function CreateTaskModal({
  isOpen,
  onClose,
  users,
  onTaskCreated,
  adminId,
  apiUrl,
}: Props) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "Medium",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${apiUrl}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": adminId,
        },
        body: JSON.stringify({
          ...newTask,
          status: "Pending",
          deadline: newTask.deadline || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create task");
      }

      setNewTask({ title: "", description: "", assignedTo: "", deadline: "", priority: "Medium" });
      onTaskCreated();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border-4 border-white p-8 w-full max-w-lg shadow-[15px_15px_0px_0px_rgba(168,85,247,0.3)] relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-neo-purple uppercase tracking-tighter">Create Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl font-bold border-2 border-transparent hover:border-white px-2"
            aria-label="Close modal">
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 p-3 mb-4 rounded-r text-xs font-mono uppercase">
            ERROR: {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Task Title</label>
            <input
              required
              placeholder="ENTER TITLE..."
              className="w-full p-3 bg-black border-2 border-gray-700 text-white focus:border-neo-purple outline-none transition-colors font-bold"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Description</label>
            <textarea
              required
              placeholder="ENTER TASK DETAILS..."
              className="w-full p-3 bg-black border-2 border-gray-700 text-white focus:border-neo-purple outline-none transition-colors resize-none text-sm"
              rows={3}
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Deadline</label>
              <input
                type="date"
                className="w-full p-3 bg-black border-2 border-gray-700 text-white focus:border-neo-purple outline-none transition-colors text-xs"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Priority</label>
              <select
                className="w-full p-3 bg-black border-2 border-gray-700 text-white focus:border-neo-purple outline-none transition-colors text-xs appearance-none font-bold"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                disabled={isSubmitting}>
                <option value="Low">LOW</option>
                <option value="Medium">MEDIUM</option>
                <option value="High">HIGH</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Assignee</label>
            <select
              required
              className="w-full p-3 bg-black border-2 border-gray-700 text-white focus:border-neo-purple outline-none transition-colors appearance-none font-bold"
              value={newTask.assignedTo}
              onChange={(e) =>
                setNewTask({ ...newTask, assignedTo: e.target.value })
              }
              disabled={isSubmitting}>
              <option
                value=""
                disabled>
                SELECT AGENT...
              </option>
              {users.map((u) => (
                <option
                  key={u._id}
                  value={u._id}>
                  {u.name.toUpperCase()} [{u.jobTitle?.toUpperCase() || "AGENT"}]
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-neo-purple hover:bg-white text-black py-4 font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 border-2 border-white shadow-neo-cyan hover:-translate-y-1 active:translate-y-0">
            {isSubmitting ? "TRANSMITTING..." : "CREATE SECURE TASK"}
          </button>
        </form>
      </div>
    </div>
  );
}
