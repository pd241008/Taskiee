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

      if (!res.ok) throw new Error("Failed to create task");

      setNewTask({ title: "", description: "", assignedTo: "", deadline: "" });
      onTaskCreated();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="bg-[#1a1a1a] border-4 border-white p-8 w-full max-w-lg shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-[#a855f7]">Create Task</h2>{" "}
          {/* Purple accent */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl font-bold"
            aria-label="Close modal">
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-4 rounded text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4">
          <input
            required
            placeholder="Task Title"
            className="w-full p-3 bg-black border-2 border-gray-600 text-white focus:border-[#a855f7] outline-none transition-colors"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            disabled={isSubmitting}
          />

          <textarea
            required
            placeholder="Task Description"
            className="w-full p-3 bg-black border-2 border-gray-600 text-white focus:border-[#a855f7] outline-none transition-colors resize-none"
            rows={3}
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            disabled={isSubmitting}
          />

          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400 uppercase">Deadline (Optional)</label>
            <input
              type="date"
              className="w-full p-3 bg-black border-2 border-gray-600 text-white focus:border-[#a855f7] outline-none transition-colors"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <select
            required
            className="w-full p-3 bg-black border-2 border-gray-600 text-white focus:border-[#a855f7] outline-none transition-colors appearance-none"
            value={newTask.assignedTo}
            onChange={(e) =>
              setNewTask({ ...newTask, assignedTo: e.target.value })
            }
            disabled={isSubmitting}>
            <option
              value=""
              disabled
              className="text-gray-500">
              Assign user...
            </option>
            {users.map((u) => (
              <option
                key={u._id}
                value={u._id}>
                {u.name} {u.jobTitle ? `— ${u.jobTitle}` : ""}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#a855f7] hover:bg-white text-black py-3 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
