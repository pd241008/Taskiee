"use client";

import { useEffect, useState } from "react";
import { TaskCard } from "@/components/ui/TaskCard";
import { TaskBadge } from "@/components/ui/TaskBadge";
import TaskDetailModal from "@/components/ui/TaskDetailModal";
import { Task, User } from "@/types/tasks";
import { getLoggedInUser } from "@/utils/auth";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    activeMembers: 0,
    completionRate: "0%",
    pendingTasks: 0,
    recentTasks: [] as Task[],
    rolesWithMembers: {} as Record<string, string[]>,
    tasksPerMember: {} as Record<string, number>,
    currentUserRole: "USER",
  });

  // Modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const isAdmin = dashboardData.currentUserRole === "ADMIN" || dashboardData.currentUserRole === "PRESIDENT";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = getLoggedInUser();
        if (!user) {
          window.location.href = "/login";
          return;
        }

        const activeUserId = user._id;
        setCurrentUserId(activeUserId);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        // Fetch both Tasks and Users simultaneously for speed
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

        if (!tasksRes.ok || !usersRes.ok || !profileRes.ok)
          throw new Error("Failed to fetch data");

        const tasks: Task[] = await tasksRes.json();
        const users: User[] = await usersRes.json();
        const profile: User = await profileRes.json();

        // 1. Calculate Stats
        const totalTasks = tasks.length;
        const activeMembers = users.length;
        const completedTasks = tasks.filter((t) => t.status === "Done").length;
        const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
        const completionRate =
          totalTasks === 0
            ? "0%"
            : `${Math.round((completedTasks / totalTasks) * 100)}%`;

        // 2. Get 3 most recent tasks
        const recentTasks = [...tasks]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        // 3. Group members by role
        const rolesWithMembers = users.reduce((acc: Record<string, string[]>, user) => {
          const role = user.jobTitle || "Unassigned";
          if (!acc[role]) acc[role] = [];
          acc[role].push(user.name);
          return acc;
        }, {});

        // 4. Count tasks per member
        const tasksPerMember = tasks.reduce((acc: Record<string, number>, task) => {
          const userName = (task.assignedTo as any)?.name || "Unknown";
          acc[userName] = (acc[userName] || 0) + 1;
          return acc;
        }, {});

        setDashboardData({
          totalTasks,
          activeMembers,
          completionRate,
          pendingTasks,
          recentTasks,
          rolesWithMembers,
          tasksPerMember,
          currentUserRole: profile.accessLevel,
        });
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: "Total Tasks",
      value: dashboardData.totalTasks.toString(),
      color: "purple" as const,
    },
    {
      label: "Active Members",
      value: dashboardData.activeMembers.toString(),
      color: "cyan" as const,
    },
    {
      label: "Completion Rate",
      value: dashboardData.completionRate,
      color: "green" as const,
    },
    {
      label: "Pending Tasks",
      value: dashboardData.pendingTasks.toString(),
      color: "yellow" as const,
    },
  ];

  if (loading) {
    return (
      <div className="p-10 max-w-7xl mx-auto flex items-center justify-center h-screen">
        <h1 className="text-4xl font-black text-neo-cyan animate-pulse uppercase">
          Syncing Systems...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12 border-b-8 border-white pb-6 flex justify-between items-end relative overflow-hidden group">
        <div className="relative z-10">
          <h1 className="text-6xl font-black uppercase tracking-[calc(-0.05em)] leading-none font-display mb-2">
            Dashboard Overview
          </h1>
          <p className="font-mono text-neo-purple text-sm font-bold tracking-tighter uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-neo-green rounded-full animate-pulse" />
            System Status: Optimal
          </p>
        </div>
        {/* Subtle background glow for header */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-neo-purple/10 blur-[100px] pointer-events-none -mr-32 -mt-32 group-hover:bg-neo-purple/20 transition-colors" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {stats.map((stat, idx) => (
          <TaskCard
            key={idx}
            color={stat.color}
            className="flex flex-col items-start py-10 px-8 group">
            <h3 className="text-xs font-black uppercase mb-4 opacity-70 tracking-widest font-mono">{stat.label}</h3>
            <p className="text-6xl font-black font-display tracking-tighter group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
            {/* Minimalist indicator line */}
            <div className={`w-8 h-1 bg-neo-${stat.color} mt-4 group-hover:w-full transition-all duration-500`} />
          </TaskCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <TaskCard color="white">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-dashed pb-2">
            Recent Tasks
          </h2>
          <div className="space-y-4">
            {dashboardData.recentTasks.length === 0 ? (
              <p className="text-gray-400 font-mono">No tasks available.</p>
            ) : (
              dashboardData.recentTasks.map((task) => {
                const statusColors = {
                  Done: "green",
                  Pending: "white",
                  "In Progress": "cyan",
                  "In Review": "yellow",
                  Blocked: "pink",
                  Todo: "purple",
                  Backlog: "gray",
                } as const;

                return (
                  <div
                    key={task._id}
                    onClick={() => {
                      setSelectedTask(task);
                      setIsDetailModalOpen(true);
                    }}
                    className="flex justify-between items-center bg-neo-bg p-4 border-2 border-gray-700 hover:border-white cursor-pointer transition-colors group">
                    <span className="font-bold truncate max-w-[60%] group-hover:text-neo-cyan">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-3">
                      <TaskBadge
                        text={task.status}
                        color={statusColors[task.status] || "gray"}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TaskCard>

        <TaskCard color="yellow">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-dashed border-black pb-2 text-black">
            Team by Role
          </h2>
          <div className="space-y-6 text-black">
            {Object.keys(dashboardData.rolesWithMembers).length === 0 ? (
              <p className="font-mono text-gray-800">No members found.</p>
            ) : (
              Object.entries(dashboardData.rolesWithMembers).map(([role, members]) => (
                <div
                  key={role}
                  className="space-y-1">
                  <div className="flex justify-between items-end border-b-2 border-black/20 pb-1">
                    <span className="uppercase text-xs font-black opacity-60 tracking-widest">{role}</span>
                    <span className="text-sm font-black">{members.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {members.map((name, i) => (
                      <span key={i} className="text-sm font-bold bg-black/10 px-2 py-0.5 rounded border border-black/5">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </TaskCard>
      </div>

      <div className="mt-10">
        <TaskCard color="cyan">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-dashed border-black pb-2 text-black">
            Tasks Assigned to Members
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(dashboardData.tasksPerMember).map(([name, count]) => (
              <div key={name} className="bg-black/10 p-4 border border-black/20 flex justify-between items-center">
                <span className="font-bold text-black uppercase text-sm">{name}</span>
                <span className="bg-black text-white px-2 py-0.5 font-black text-xs">{count} TASKS</span>
              </div>
            ))}
          </div>
        </TaskCard>
      </div>

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
        statusColor={
          (selectedTask?.status === "Done"
            ? "green"
            : selectedTask?.status === "Pending"
              ? "white"
              : selectedTask?.status === "In Progress"
                ? "cyan"
                : selectedTask?.status === "In Review"
                  ? "yellow"
                  : selectedTask?.status === "Blocked"
                    ? "pink"
                    : selectedTask?.status === "Todo"
                      ? "purple"
                      : "gray") as any
        }
        isAdmin={isAdmin}
        onTaskUpdated={() => window.location.reload()}
        currentUserId={currentUserId}
      />
    </div>
  );
}
