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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const MY_ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID as string;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/users`, {
        headers: { "x-user-id": MY_ADMIN_ID },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const users: User[] = await res.json();

      type GroupedRoles = Record<
        string,
        { title: string; members: (User & { active: number })[] }
      >;

      const grouped = users.reduce((acc: GroupedRoles, user) => {
        const role = user.jobTitle || "Unassigned";
        if (!acc[role]) {
          acc[role] = { title: role, members: [] };
        }
        acc[role].members.push({ ...user, active: 0 });
        return acc;
      }, {} as GroupedRoles);

      const colorMap = ["cyan", "pink", "yellow", "green", "purple"] as const;

      const formattedRoles: RoleGroup[] = Object.values(grouped).map(
        (group, idx) => ({
          ...group,
          color: colorMap[idx % colorMap.length],
        }),
      );

      setRoles(formattedRoles);
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
        <TaskButton
          color="cyan"
          onClick={() => setIsModalOpen(true)}>
          + Add Member
        </TaskButton>
      </header>

      <div className="space-y-12">
        {roles.map((group, idx) => (
          <section key={idx}>
            <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
              <span
                className={`w-4 h-4 ${
                  group.color === "cyan"
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

                  <div className="border-t-2 border-dashed border-gray-600 pt-3 mt-3 flex justify-between">
                    <span className="text-xs text-gray-400">Active Tasks</span>
                    <span className="font-black">{member.active}</span>
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
        adminId={MY_ADMIN_ID}
      />
    </div>
  );
}
