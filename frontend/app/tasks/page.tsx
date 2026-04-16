"use client";

import { DndContext, closestCorners, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useEffect, useState, useCallback } from "react";
import { TaskButton } from "@/components/ui/TaskButton";
import { TaskCard } from "@/components/ui/TaskCard";
import { TaskBadge, BadgeColor } from "@/components/ui/TaskBadge";
import CreateTaskModal from "@/components/ui/CreateTaskModal";
import ManageTeamModal from "@/components/ui/CreateMemberModal";
import { KanbanColumn } from "@/components/ui/KanbanColumn";
import TaskDetailModal from "@/components/ui/TaskDetailModal";
import { Task, User, TaskStatus } from "@/types/tasks";
import { getLoggedInUser } from "@/utils/auth";

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
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Detail Modal state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Environment & Auth (Defensive checks added)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const isAdmin = currentUserRole === "ADMIN" || currentUserRole === "PRESIDENT";
  const isPresident = currentUserRole === "PRESIDENT";

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = getLoggedInUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const activeUserId = user._id;
      setCurrentUserId(activeUserId);
      setCurrentUserRole(user.accessLevel);

      const [tasksRes, usersRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/api/tasks`, {
          headers: { "x-user-id": activeUserId },
        }),
        fetch(`${API_URL}/api/users`, {
          headers: { "x-user-id": activeUserId },
        }),
        fetch(`${API_URL}/api/users/${activeUserId}`, {
          headers: { "x-user-id": activeUserId },
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
  }, [API_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    let newStatus: TaskStatus;

    // Resolve the destination container (column)
    // dnd-kit gives us the container ID if dropped over a SortableContext/Droppable
    // or the item ID if dropped over a SortableItem
    const overId = over.id as string;

    // Check if overId is a valid status/column key
    const isColumn = statusConfig.some((s) => s.key === overId) || overId === "unknown";

    if (isColumn) {
      newStatus = overId as TaskStatus;
    } else {
      // Find which column this task belongs to
      const overTask = tasks.find((t) => t._id === overId);
      if (overTask) {
        newStatus = overTask.status;
      } else {
        console.error("Could not resolve status for target:", overId);
        return;
      }
    }

    // Protection for data recovery
    if (newStatus === "unknown" as any) return;

    // Find the task being moved
    const taskToMove = tasks.find((t) => t._id === taskId);
    if (!taskToMove) return;

    // Permission check
    const canMove = isAdmin || taskToMove.assignedTo?._id === currentUserId;
    if (!canMove) {
      alert("Unauthorized: You can only move tasks assigned to you.");
      return;
    }

    if (taskToMove.status === newStatus) return;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Status update failed");
      }
    } catch (err: any) {
      console.error("Failed to update status, reverting...", err);
      alert(err.message || "Failed to sync update with server.");
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: taskToMove.status } : t,
        ),
      );
    }
  };

  // Logic to find tasks that don't match any known status
  const unknownTasks = tasks.filter(
    (t) => !statusConfig.some((s) => s.key === t.status) && t.status !== ("Completed" as any)
  );

  const activeTask = activeId ? tasks.find(t => t._id === activeId) : null;

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
    <div className="p-10 flex flex-col h-screen max-w-[1600px] mx-auto overflow-hidden">
      <header className="mb-12 border-b-8 border-white pb-6 flex justify-between items-end relative overflow-hidden group">
        <div className="relative z-10">
          <h1 className="text-6xl font-black uppercase tracking-[calc(-0.05em)] leading-none font-display mb-2">
            Task Board
          </h1>
          <p className="font-mono text-neo-green text-sm font-bold tracking-tighter uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-neo-green rounded-full animate-pulse" />
            System Status: Operational
          </p>
        </div>

        <div className="flex gap-4 relative z-10">
          {isAdmin && (
            <TaskButton onClick={() => setIsTeamModalOpen(true)}>
              Manage Team
            </TaskButton>
          )}

          <TaskButton color="green" onClick={() => setIsTaskModalOpen(true)}>
            + Create Task
          </TaskButton>
        </div>
        
        {/* Subtle background glow for header */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-neo-green/5 blur-[100px] pointer-events-none -mr-32 -mt-32 transition-colors" />
      </header>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto flex-1 pb-4">
          {unknownTasks.length > 0 && (
            <KanbanColumn
              key="unknown"
              title="unknown" // Machine-friendly ID for internal logic
              tasks={unknownTasks}
              color="gray"
              onTaskClick={handleTaskClick}
              isAdmin={isAdmin}
              currentUserId={currentUserId}
            />
          )}

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
              currentUserId={currentUserId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80 scale-105 transition-transform">
               <TaskCard color={
                (statusConfig.find(s => s.key === activeTask.status)?.color || "white") as any
               }>
                <TaskBadge text={activeTask.status} color={
                  (statusConfig.find(s => s.key === activeTask.status)?.color || "gray") as any
                } />
                <h3 className="font-bold mt-2">{activeTask.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{activeTask.description}</p>
              </TaskCard>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* --- MODALS --- */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        users={users}
        onTaskCreated={fetchData}
        adminId={currentUserId}
        apiUrl={API_URL}
      />

      <ManageTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onTeamUpdated={fetchData}
        apiUrl={API_URL}
        adminId={currentUserId}
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
        currentUserId={currentUserId}
      />
    </div>
  );
}
