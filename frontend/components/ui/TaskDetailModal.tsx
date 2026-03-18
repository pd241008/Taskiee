"use client";

import { TaskBadge, BadgeColor } from "./TaskBadge";
import { TaskButton } from "./TaskButton";
import { Task } from "@/types/tasks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  statusColor: BadgeColor;
}

export default function TaskDetailModal({ isOpen, onClose, task, statusColor }: Props) {
  if (!isOpen || !task) return null;

  // Format the date for a more premium experience
  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-6 backdrop-blur-sm">
      <div 
        className="bg-[#1a1a1a] border-4 border-white w-full max-w-2xl shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)] animate-in fade-in zoom-in duration-300 relative overflow-hidden"
      >
        {/* Accent Strip */}
        <div className={`h-2 w-full bg-neo-${statusColor === 'gray' ? 'white' : statusColor}`} />

        <div className="p-10">
          <header className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <TaskBadge text={task.status} color={statusColor} />
                <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                  // {task._id.slice(-8)}
                </span>
              </div>
              <h2 className="text-4xl font-black uppercase leading-tight tracking-tight">
                {task.title}
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl font-black p-2 border-2 border-transparent hover:border-white"
              aria-label="Close modal"
            >
              ✕
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xs font-mono text-gray-500 uppercase mb-3 border-b border-gray-800 pb-1">
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                  {task.description || "No description provided for this objective."}
                </p>
              </div>

              <div className="flex gap-10">
                <div>
                  <h3 className="text-xs font-mono text-gray-500 uppercase mb-2">Created</h3>
                  <p className="font-bold">{formattedDate}</p>
                </div>
                <div>
                  <h3 className="text-xs font-mono text-gray-500 uppercase mb-2">Security</h3>
                  <p className="font-bold text-neo-green uppercase">Clearance A-1</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-black/40 p-6 border-2 border-dashed border-gray-700">
              <div>
                <h3 className="text-xs font-mono text-gray-500 uppercase mb-3">Assigned Agent</h3>
                {task.assignedTo ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neo-purple border-2 border-white flex items-center justify-center font-black">
                      {task.assignedTo.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-none mb-1">{task.assignedTo.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-mono italic">
                        {task.assignedTo.jobTitle || "Agent"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm font-mono uppercase">Unassigned</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
                <TaskButton color="white" className="w-full text-xs py-2" onClick={onClose}>
                  Acknowledge
                </TaskButton>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Glitch Ornament */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10 py-2 bg-black/50 border-t border-gray-800">
          <span className="text-[10px] font-mono text-gray-600 uppercase">System::Taskie::Terminal_V2</span>
          <span className="text-[10px] font-mono text-gray-600 uppercase">ACCESS_LOG: SUCCESSFUL</span>
        </div>
      </div>
    </div>
  );
}
