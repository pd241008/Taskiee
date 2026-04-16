"use client";

import { useState, useEffect } from "react";
import { TaskBadge, BadgeColor } from "./TaskBadge";
import { TaskButton } from "./TaskButton";
import { Task, TaskStatus } from "@/types/tasks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  statusColor: BadgeColor;
  isAdmin?: boolean;
  onTaskUpdated?: () => void;
  currentUserId: string;
}

const statusOptions: TaskStatus[] = [
  "Pending",
  "Backlog",
  "Todo",
  "In Progress",
  "In Review",
  "Blocked",
  "Done",
];

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  statusColor: initialStatusColor,
  isAdmin = false,
  onTaskUpdated,
  currentUserId,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState<TaskStatus>("Pending");
  const [editedReview, setEditedReview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedStatus(task.status);
      setEditedReview(task.reviewNotes || "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSave = async (statusToSave?: TaskStatus) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks/${task._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
        body: JSON.stringify({
          status: statusToSave || editedStatus,
          reviewNotes: editedReview,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      if (onTaskUpdated) onTaskUpdated();
      setIsEditing(false);
      if (statusToSave === "Done") onClose();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isAssignee = task.assignedTo?._id === currentUserId;
  const showCompleteButton = !isAdmin && isAssignee && task.status !== "Done";

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-6 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border-4 border-white w-full max-w-2xl shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)] animate-in fade-in zoom-in duration-300 relative overflow-hidden">
        <div
          className={`h-2 w-full bg-neo-${initialStatusColor === "gray" ? "white" : initialStatusColor}`}
        />

        <div className="p-10">
          <header className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isAdmin && isEditing ? (
                  <select
                    value={editedStatus}
                    onChange={(e) =>
                      setEditedStatus(e.target.value as TaskStatus)
                    }
                    className="bg-black border-2 border-white text-white px-2 py-1 font-mono text-xs uppercase outline-none">
                    {statusOptions.map((s) => (
                      <option
                        key={s}
                        value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <TaskBadge
                    text={task.status}
                    color={initialStatusColor}
                  />
                )}
                <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                  {task._id.slice(-8)}
                </span>
              </div>
              <h2 className="text-4xl font-black uppercase leading-tight tracking-tight">
                {task.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl font-black p-2 border-2 border-transparent hover:border-white">
              ✕
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-xs font-mono text-gray-500 uppercase mb-3 border-b border-gray-800 pb-1">
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {task.description || "No description provided."}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono text-neo-yellow uppercase mb-3 border-b border-gray-800 pb-1">
                  Admin Review / Notes
                </h3>
                {isAdmin && isEditing ? (
                  <textarea
                    value={editedReview}
                    onChange={(e) => setEditedReview(e.target.value)}
                    placeholder="Enter review notes here..."
                    className="w-full bg-black border-2 border-gray-600 p-3 text-sm text-white focus:border-neo-yellow outline-none font-mono"
                    rows={4}
                  />
                ) : (
                  <p className="text-neo-yellow/80 font-mono text-sm italic">
                    {task.reviewNotes || "--- No review notes provided yet ---"}
                  </p>
                )}
              </div>

              <div className="flex gap-10">
                <div>
                  <h3 className="text-xs font-mono text-gray-500 uppercase mb-2">
                    Created
                  </h3>
                  <p className="font-bold">{formattedDate}</p>
                </div>
                <div>
                  <h3 className="text-xs font-mono text-gray-500 uppercase mb-2">
                    Security
                  </h3>
                  <p className="font-bold text-neo-green uppercase">Level 1</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-black/40 p-6 border-2 border-dashed border-gray-700">
              <div>
                <h3 className="text-xs font-mono text-gray-500 uppercase mb-3">
                  Assigned Agent
                </h3>
                {task.assignedTo ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neo-purple border-2 border-white flex items-center justify-center font-black">
                      {task.assignedTo.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-none mb-1">
                        {task.assignedTo.name}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-mono italic">
                        {task.assignedTo.jobTitle || "Agent"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm font-mono uppercase">
                    Unassigned
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
                {isAdmin ? (
                  isEditing ? (
                    <>
                      <TaskButton
                        color="green"
                        className="w-full text-xs py-2"
                        onClick={() => handleSave()}
                        disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </TaskButton>
                      <TaskButton
                        color="white"
                        className="w-full text-xs py-2"
                        onClick={() => setIsEditing(false)}>
                        Cancel
                      </TaskButton>
                    </>
                  ) : (
                    <TaskButton
                      color="yellow"
                      className="w-full text-xs py-2"
                      onClick={() => setIsEditing(true)}>
                      Edit Task Details
                    </TaskButton>
                  )
                ) : (
                  <>
                    {showCompleteButton && (
                      <TaskButton
                        color="green"
                        className="w-full text-xs py-3 border-4 hover:scale-105 transition-all"
                        onClick={() => handleSave("Done")}
                        disabled={isSaving}>
                        {isSaving ? "PROCESSING..." : "MARK AS COMPLETED"}
                      </TaskButton>
                    )}
                    <TaskButton
                      color="white"
                      className="w-full text-xs py-2"
                      onClick={onClose}>
                      Acknowledge
                    </TaskButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10 py-2 bg-black/50 border-t border-gray-800">
          <span className="text-[10px] font-mono text-gray-600 uppercase">
            System::Taskie::Terminal
          </span>
          <span className="text-[10px] font-mono text-gray-600 uppercase">
            STATUS: {isEditing ? "EDITING" : "SECURE"}
          </span>
        </div>
      </div>
    </div>
  );
}
