"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskBadge } from "./TaskBadge";

export default function SideBar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("taskiee_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("taskiee_user");
    window.location.href = "/login";
  };

  const links = [
    { name: "Dashboard", path: "/dashboard", color: "purple" as const },
    { name: "Directory", path: "/directory", color: "cyan" as const },
    { name: "Task Board", path: "/tasks", color: "green" as const },
    { name: "Reports", path: "/reports", color: "pink" as const },
  ];

  return (
    <aside className="w-64 border-r-4 border-white bg-neo-bg h-screen fixed left-0 top-0 flex flex-col p-6 z-50">
      <div className="mb-12">
        <Link href="/">
          <h1 className="text-4xl font-black tracking-tighter uppercase hover:text-neo-purple transition-all cursor-pointer font-display">
            Task<span className="text-neo-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">iee</span>
          </h1>
        </Link>
        <div className="mt-2">
          <TaskBadge
            text="Workspace Admin"
            color="yellow"
          />
        </div>
      </div>

      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.path}>
            <div
              className={`group relative p-4 border-2 border-transparent hover:border-white hover:bg-white/5 hover:shadow-neo-${link.color} transition-all duration-300 cursor-pointer font-black uppercase tracking-widest text-sm`}>
              <span className="relative z-10">{link.name}</span>
              {/* Animated indicator on hover */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-neo-${link.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 space-y-4">
        {user ? (
          <div className="p-4 border-2 border-white bg-neo-card shadow-neo-purple group relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-neo-purple border-2 border-white flex items-center justify-center font-black shadow-neo-white">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-xs uppercase tracking-tight truncate">{user.name}</p>
                <p className="text-[10px] font-mono text-neo-green font-bold uppercase truncate">{user.jobTitle}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="mt-4 w-full bg-white text-black font-black text-[10px] py-2 border-2 border-black hover:bg-neo-pink transition-colors uppercase tracking-widest">
              Emergency Exit (Logout)
            </button>
          </div>
        ) : (
          <Link href="/login" className="block w-full bg-neo-purple text-black font-black py-3 text-center border-2 border-white shadow-neo-cyan hover:bg-white transition-all uppercase text-sm">
            Access Port
          </Link>
        )}
      </div>
    </aside>
  );
}
