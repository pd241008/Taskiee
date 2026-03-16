import { TaskCard } from "@/components/ui/TaskCard";
import { TaskBadge } from "@/components/ui/TaskBadge";

export default function DashboardPage() {
  const stats = [
    { label: "Total Tasks", value: "1,284", color: "purple" as const },
    { label: "Active Members", value: "42", color: "cyan" as const },
    { label: "Completion Rate", value: "87%", color: "green" as const },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
            {["API Integration", "Security Audit", "UI Redesign"].map(
              (task, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-neo-bg p-4 border-2 border-gray-700">
                  <span className="font-bold">{task}</span>
                  <TaskBadge
                    text={i === 2 ? "Completed" : "Pending"}
                    color={i === 2 ? "green" : "yellow"}
                  />
                </div>
              ),
            )}
          </div>
        </TaskCard>

        <TaskCard color="yellow">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-dashed border-black pb-2 text-black">
            Members by Role
          </h2>
          <div className="space-y-4 text-black font-bold">
            <div className="flex justify-between">
              <span>Engineering</span>
              <span className="text-xl font-black">12</span>
            </div>
            <div className="flex justify-between">
              <span>Design</span>
              <span className="text-xl font-black">4</span>
            </div>
            <div className="flex justify-between">
              <span>Leadership</span>
              <span className="text-xl font-black">2</span>
            </div>
          </div>
        </TaskCard>
      </div>
    </div>
  );
}
