import Link from "next/link";
import { TaskBadge } from "./TaskBadge";

export default function SideBar() {
  const links = [
    { name: "Dashboard", path: "/dashboard", color: "purple" as const },
    { name: "Directory", path: "/directory", color: "cyan" as const },
    { name: "Task Board", path: "/tasks", color: "green" as const },
  ];

  return (
    <aside className="w-64 border-r-4 border-white bg-neo-bg h-screen fixed left-0 top-0 flex flex-col p-6 z-50">
      <div className="mb-12">
        <Link href="/">
          <h1 className="text-3xl font-black tracking-tighter uppercase hover:text-neo-purple transition-colors cursor-pointer">
            Task<span className="text-neo-purple">iee</span>
          </h1>
        </Link>
        <TaskBadge
          text="Workspace Admin"
          color="yellow"
        />
      </div>

      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.path}>
            <div
              className={`p-3 border-2 border-transparent hover:border-white hover:shadow-neo-${link.color} transition-all cursor-pointer font-bold uppercase tracking-wide`}>
              {link.name}
            </div>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t-2 border-dashed border-gray-600 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neo-purple border-2 border-white flex items-center justify-center font-black">
            PD
          </div>
          <div>
            <p className="font-bold text-sm">Prathmesh D.</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
