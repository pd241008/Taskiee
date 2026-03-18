"use client";

import { useEffect, useState, useCallback } from "react";
import { TaskCard } from "@/components/ui/TaskCard";
import { TaskBadge } from "@/components/ui/TaskBadge";
import { TaskButton } from "@/components/ui/TaskButton";
import ManageTeamModal from "@/components/ui/CreateMemberModal";

interface User {
  _id: string;
  name: string;
  email: string;
  jobTitle: string;
  accessLevel: "PRESIDENT" | "ADMIN" | "USER";
  activeTasks?: { title: string; status: string }[];
}

interface RoleGroup {
  title: string;
  color: "cyan" | "pink" | "yellow" | "green" | "purple";
  members: (User & { active: number })[];
}

export default function DirectoryPage() {
  const [roles, setRoles] = useState<RoleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("USER");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const MY_ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID as string;
  const CURRENT_USER_ID = process.env.NEXT_PUBLIC_CURRENT_USER_ID || MY_ADMIN_ID;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const isAdmin = currentUserRole === "ADMIN" || currentUserRole === "PRESIDENT";

  interface Task {
    _id: string;
    title: string;
    status: string;
    assignedTo: string;
  }

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, tasksRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/api/users`, {
          headers: { "x-user-id": CURRENT_USER_ID },
        }),
        fetch(`${API_URL}/api/tasks`, {
          headers: { "x-user-id": CURRENT_USER_ID },
        }),
        fetch(`${API_URL}/api/users/${CURRENT_USER_ID}`, {
          headers: { "x-user-id": CURRENT_USER_ID },
        }),
      ]);

      if (!usersRes.ok || !tasksRes.ok || !profileRes.ok) throw new Error("Failed to fetch data");

      const users: User[] = await usersRes.json();
      const tasks: Task[] = await tasksRes.json();
      const profile = await profileRes.json();

      setCurrentUserRole(profile.accessLevel);

      type GroupedRoles = Record<
        string,
        { title: string; members: (User & { activeTasks: Task[] })[] }
      >;

      const grouped = users.reduce((acc: GroupedRoles, user) => {
        const role = user.jobTitle || "Unassigned";
        if (!acc[role]) {
          acc[role] = { title: role, members: [] };
        }

        const userTasks = tasks.filter(t =>
          (typeof t.assignedTo === 'string' ? t.assignedTo : (t.assignedTo as any)._id) === user._id
        );

        acc[role].members.push({ ...user, activeTasks: userTasks });
        return acc;
      }, {} as GroupedRoles);

      const colorMap = ["cyan", "pink", "yellow", "green", "purple"] as const;

      const formattedRoles: RoleGroup[] = Object.values(grouped).map(
        (group, idx) => ({
          title: group.title,
          color: colorMap[idx % colorMap.length],
          members: group.members.map(m => ({
            ...m,
            active: m.activeTasks.filter(t => t.status !== 'Done').length
          }))
        }),
      );

      setRoles(formattedRoles as any);
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [MY_ADMIN_ID, API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 🔥 LOADING UI
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-black text-neo-cyan animate-pulse uppercase">
          Loading Directory...
        </p>
      </div>
    );
  }

  // 🔥 ERROR UI
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-bold text-xl">{error}</p>
        <TaskButton onClick={fetchUsers}>Retry</TaskButton>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="mb-10 border-b-4 border-white pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tight">
            Team Directory
          </h1>
          <p className="font-mono text-neo-cyan mt-2 uppercase">
            ACTIVE DATABASE: TEAM ARCHIVE
          </p>
        </div>

        {/* ✅ FIXED */}
        {isAdmin && (
          <TaskButton
            color="cyan"
            onClick={() => setIsModalOpen(true)}>
            + Add Member
          </TaskButton>
        )}
      </header>

      <div className="space-y-12">
        {roles.map((group, idx) => (
          <section key={idx}>
            <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
              <span
                className={`w-4 h-4 ${group.color === "cyan"
                  ? "bg-neo-cyan"
                  : group.color === "pink"
                    ? "bg-neo-pink"
                    : group.color === "yellow"
                      ? "bg-neo-yellow"
                      : group.color === "green"
                        ? "bg-neo-green"
                        : "bg-neo-purple"
                  }`}
              />
              {group.title}
              <span className="text-sm font-mono text-gray-500 uppercase">
                {group.members.length} Members
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.members.map((member) => (
                <TaskCard
                  key={member._id}
                  color={group.color}>
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-gray-800 border-2 border-white flex items-center justify-center font-black text-xl">
                      {member.name.charAt(0)}
                    </div>

                    <TaskBadge
                      text={member.jobTitle}
                      color={group.color}
                    />
                  </div>

                  <h3 className="font-bold text-xl mt-2">{member.name}</h3>

                  <p className="text-sm text-gray-400">{member.email}</p>

                  {/* ✅ Task List for Assignment Requirement */}
                  {member.activeTasks && member.activeTasks.length > 0 && (
                    <div className="mt-4 space-y-1">
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-1 mb-2">
                        Assigned Tasks
                      </p>
                      <ul className="text-xs font-mono space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
                        {member.activeTasks.map((t, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-300">
                            <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Done' ? 'bg-neo-green' : 'bg-neo-yellow'}`} />
                            <span className="truncate">{t.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t-2 border-dashed border-gray-600 pt-3 mt-3 flex justify-between">
                    <span className="text-xs text-gray-400">Total Tasks</span>
                    <span className="font-black">{member.activeTasks?.length || 0}</span>
                  </div>
                </TaskCard>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ✅ MODAL */}
      <ManageTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTeamUpdated={fetchUsers}
        apiUrl={API_URL}
        adminId={CURRENT_USER_ID}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}
