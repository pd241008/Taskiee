"use client";

import { useEffect, useState } from "react";
import { TaskCard } from "@/components/ui/TaskCard";
import { TaskBadge } from "@/components/ui/TaskBadge";
import TaskDetailModal from "@/components/ui/TaskDetailModal";
import { Task, User } from "@/types/tasks";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    activeMembers: 0,
    completionRate: "0%",
    pendingTasks: 0,
    recentTasks: [] as Task[],
    rolesCount: {} as Record<string, number>,
  });

  // Modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const MY_ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID as string;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch both Tasks and Users simultaneously for speed
        const [tasksRes, usersRes] = await Promise.all([
          fetch("http://localhost:5000/api/tasks", {
            headers: { "x-user-id": MY_ADMIN_ID },
          }),
          fetch("http://localhost:5000/api/users", {
            headers: { "x-user-id": MY_ADMIN_ID },
          }),
        ]);

        if (!tasksRes.ok || !usersRes.ok)
          throw new Error("Failed to fetch data");

        const tasks: Task[] = await tasksRes.json();
        const users: User[] = await usersRes.json();

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

        // 3. Group and count members
        const rolesCount = users.reduce((acc: Record<string, number>, user) => {
          acc[user.jobTitle] = (acc[user.jobTitle] || 0) + 1;
          return acc;
        }, {});

        setDashboardData({
          totalTasks,
          activeMembers,
          completionRate,
          pendingTasks,
          recentTasks,
          rolesCount,
        });
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [MY_ADMIN_ID]);

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
    <div className="p-10 max-w-7xl mx-auto">
      <header className="mb-10 border-b-4 border-white pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tight">
            Dashboard Overview
          </h1>
          <p className="font-mono text-neo-purple mt-2">
            SYSTEM STATUS: OPTIMAL
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat, idx) => (
          <TaskCard
            key={idx}
            color={stat.color}
            className="flex flex-col items-center py-8">
            <h3 className="text-lg font-bold uppercase mb-2">{stat.label}</h3>
            <p className="text-5xl font-black">{stat.value}</p>
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
            Members by Role
          </h2>
          <div className="space-y-4 text-black font-bold">
            {Object.keys(dashboardData.rolesCount).length === 0 ? (
              <p className="font-mono text-gray-800">No members found.</p>
            ) : (
              Object.entries(dashboardData.rolesCount).map(([role, count]) => (
                <div
                  key={role}
                  className="flex justify-between border-b-2 border-transparent hover:border-black transition-colors pb-1">
                  <span className="uppercase">{role}</span>
                  <span className="text-xl font-black">{count}</span>
                </div>
              ))
            )}
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
      />
    </div>
  );
}
