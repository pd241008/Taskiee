import { TaskCard } from "@/components/ui/TaskCard";
import { TaskBadge } from "@/components/ui/TaskBadge";
import { TaskButton } from "@/components/ui/TaskButton";

export default function DirectoryPage() {
  const roles = [
    {
      title: "Engineering",
      color: "cyan" as const,
      members: [
        {
          name: "Alex Rivera",
          role: "Tech Lead",
          email: "alex@taskportal.io",
          active: 14,
        },
        {
          name: "Sarah Jenkins",
          role: "Developer",
          email: "sarah@taskportal.io",
          active: 9,
        },
      ],
    },
    {
      title: "Design",
      color: "pink" as const,
      members: [
        {
          name: "Elena Rodriguez",
          role: "Designer",
          email: "elena@taskportal.io",
          active: 21,
        },
      ],
    },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="mb-10 border-b-4 border-white pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tight">
            Team Directory
          </h1>
          <p className="font-mono text-gray-400 mt-2">
            Manage roles and permissions.
          </p>
        </div>
        <TaskButton color="cyan">+ Add Member</TaskButton>
      </header>

      <div className="space-y-12">
        {roles.map((group, idx) => (
          <section key={idx}>
            <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
              <span
                className={`w-4 h-4 inline-block bg-neo-${group.color}`}></span>
              {group.title}{" "}
              <span className="text-sm font-mono text-gray-500">
                {group.members.length} Members
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.members.map((member, i) => (
                <TaskCard
                  key={i}
                  color={group.color}
                  className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-gray-800 border-2 border-white flex items-center justify-center font-black text-xl">
                      {member.name.charAt(0)}
                    </div>
                    <TaskBadge
                      text={member.role}
                      color={group.color}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{member.name}</h3>
                    <p className="text-sm font-mono text-gray-400">
                      {member.email}
                    </p>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-600 pt-3 flex justify-between items-center mt-2">
                    <span className="text-xs uppercase font-bold text-gray-400">
                      Active Tasks
                    </span>
                    <span className="font-black text-lg">{member.active}</span>
                  </div>
                </TaskCard>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
