import { TaskCard } from "@/components/ui/TaskCard";
import { TaskBadge } from "@/components/ui/TaskBadge";
import { TaskButton } from "@/components/ui/TaskButton";

export default function TasksPage() {
  const columns = [
    {
      title: "To Do (Pending)",
      color: "purple" as const,
      tasks: [
        {
          title: "Draft Q3 Social Media Content",
          desc: "Create visual strategy for summer campaign.",
          assignee: "Elena R.",
          date: "Mar 18",
        },
        {
          title: "User Interview Analysis",
          desc: "Synthesize findings from mobile app users.",
          assignee: "Marcus T.",
          date: "Mar 20",
        },
      ],
    },
    {
      title: "In Progress",
      color: "yellow" as const,
      tasks: [
        {
          title: "API Integration: Stripe",
          desc: "Implementing multi-vendor payout system.",
          assignee: "Alex R.",
          date: "Mar 17",
        },
      ],
    },
    {
      title: "Completed",
      color: "green" as const,
      tasks: [
        {
          title: "Brand Identity v2",
          desc: "Package all logo variations for handoff.",
          assignee: "Elena R.",
          date: "Mar 10",
        },
      ],
    },
  ];

  return (
    <div className="p-10 max-w-1600px mx-auto h-screen flex flex-col">
      <header className="mb-10 border-b-4 border-white pb-4 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tight">
            Product Roadmap
          </h1>
          <p className="font-mono text-gray-400 mt-2">Sprint v2.4.0</p>
        </div>
        <TaskButton color="purple">+ Create Task</TaskButton>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className="flex flex-col h-full">
            <h2
              className={`text-xl font-black uppercase mb-4 py-2 border-b-4 border-neo-${col.color}`}>
              {col.title}{" "}
              <span className="text-sm ml-2 text-gray-500">
                {col.tasks.length}
              </span>
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-10">
              {col.tasks.map((task, i) => (
                <TaskCard
                  key={i}
                  color={col.color}
                  className="cursor-grab active:cursor-grabbing">
                  <div className="flex justify-between mb-3">
                    <TaskBadge
                      text={col.title === "Completed" ? "Completed" : "Pending"}
                      color={col.color}
                    />
                    <span className="text-xs font-mono font-bold">
                      {task.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 leading-tight">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {task.desc}
                  </p>
                  <div className="flex justify-between items-center border-t-2 border-dashed border-gray-600 pt-3">
                    <span className="text-xs font-mono">Assignee:</span>
                    <span className="font-bold text-sm bg-black px-2 py-1 border border-white">
                      {task.assignee}
                    </span>
                  </div>
                </TaskCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
