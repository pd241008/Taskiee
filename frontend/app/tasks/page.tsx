"use client";

import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState, useCallback } from "react";
import { TaskButton } from "@/components/ui/TaskButton";
import CreateTaskModal from "@/components/ui/CreateTaskModal";
import ManageTeamModal from "@/components/ui/CreateMemberModal";
import { BadgeColor } from "@/components/ui/TaskBadge";
import { KanbanColumn } from "@/components/ui/KanbanColumn";
import TaskDetailModal from "@/components/ui/TaskDetailModal";
import { Task, User, TaskStatus } from "@/types/tasks";

/* ================= CONFIG ================= */

const statusConfig = [
  { key: "Pending", color: "white" },
  { key: "Backlog", color: "gray" },
  { key: "Todo", color: "purple" },
  { key: "In Progress", color: "cyan" },
  { key: "In Review", color: "yellow" },
  { key: "Blocked", color: "pink" },
  { key: "Done", color: "green" },
] satisfies { key: TaskStatus; color: BadgeColor }[];

/* ================= PAGE ================= */

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>("USER");
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Detail Modal state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Environment & Auth (Defensive checks added)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID || "admin-fallback-id";
  const CURRENT_USER_ID = process.env.NEXT_PUBLIC_CURRENT_USER_ID || ADMIN_ID;
  const isAdmin = currentUserRole === "ADMIN" || currentUserRole === "PRESIDENT";
  const isPresident = currentUserRole === "PRESIDENT";

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [tasksRes, usersRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/api/tasks`, {
          headers: { "x-user-id": CURRENT_USER_ID },
        }),
        fetch(`${API_URL}/api/users`, {
          headers: { "x-user-id": CURRENT_USER_ID },
        }),
        fetch(`${API_URL}/api/users/${CURRENT_USER_ID}`, {
          headers: { "x-user-id": CURRENT_USER_ID },
        }),
      ]);

      if (!tasksRes.ok || !usersRes.ok || !profileRes.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const tasksData = await tasksRes.json();
      const usersData = await usersRes.json();
      const profileData = await profileRes.json();

      setTasks(tasksData);
      setUsers(usersData);
      setCurrentUserRole(profileData.accessLevel);
    } catch (err) {
      console.error("Data fetching error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, CURRENT_USER_ID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Find previous task to check permissions and for revert
    const taskToMove = tasks.find((t) => t._id === taskId);
    if (!taskToMove) return;

    // Permission check (matching component level check for safety)
    const canMove = isAdmin || taskToMove.assignedTo?._id === CURRENT_USER_ID;
    if (!canMove) {
      alert("Unauthorized: You can only move tasks assigned to you.");
      return;
    }

    // Treat "Completed" as "Done" for equality check
    const currentEffectiveStatus =
      (taskToMove.status === "Done" || (taskToMove.status as string) === "Completed")
        ? "Done"
        : taskToMove.status;

    if (currentEffectiveStatus === newStatus) return;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": CURRENT_USER_ID,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Status update failed");
      }

      // Successfully updated on server.
      // We could merge the response task here if needed.
    } catch (err: any) {
      console.error("Failed to update status, reverting...", err);
      alert(err.message || "Failed to sync update with server.");
      // Revert optimistic update on failure
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: taskToMove.status } : t,
        ),
      );
    }
  };

  // Render a simple loading skeleton/spinner while booting up
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-black text-neo-green animate-pulse uppercase">
          Loading Task Board...
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-col h-screen">
      <header className="mb-10 border-b-4 border-white pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tight">Task Board</h1>
          <p className="font-mono text-neo-green mt-2 uppercase">
            SYSTEM STATUS: OPERATIONAL
          </p>
        </div>

        <div className="flex gap-4">
          {isAdmin && (
            <TaskButton onClick={() => setIsTeamModalOpen(true)}>
              Manage Team
            </TaskButton>
          )}

          <TaskButton color="green" onClick={() => setIsTaskModalOpen(true)}>
            + Create Task
          </TaskButton>
        </div>
      </header>

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto flex-1 pb-4">
          {statusConfig.map(({ key, color }) => (
            <KanbanColumn
              key={key}
              title={key}
              tasks={tasks.filter((t) =>
                key === "Done"
                  ? t.status === "Done" || (t.status as string) === "Completed"
                  : t.status === key
              )}
              color={color}
              onTaskClick={handleTaskClick}
              isAdmin={isAdmin}
              currentUserId={CURRENT_USER_ID}
            />
          ))}
        </div>
      </DndContext>

      {/* --- MODALS --- */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        users={users}
        onTaskCreated={fetchData}
        adminId={CURRENT_USER_ID}
        apiUrl={API_URL}
      />

      <ManageTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onTeamUpdated={fetchData}
        apiUrl={API_URL}
        adminId={CURRENT_USER_ID}
        currentUserRole={currentUserRole}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
        statusColor={
          statusConfig.find((s) =>
            selectedTask?.status === ("Completed" as any)
              ? s.key === "Done"
              : s.key === selectedTask?.status
          )?.color || "gray"
        }
        isAdmin={isAdmin}
        onTaskUpdated={fetchData}
      />
    </div>
  );
}
