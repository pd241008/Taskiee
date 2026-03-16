import { TaskButton } from "@/components/ui/TaskButton";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[url('/grid.svg')]">
      <div className="max-w-3xl">
        <h1 className="text-7xl font-black uppercase tracking-tighter mb-6 shadow-black drop-shadow-lg">
          Manage{" "}
          <span className="text-neo-cyan bg-black px-2 border-4 border-white">
            Roles.
          </span>
          <br />
          Execute{" "}
          <span className="text-neo-green bg-black px-2 border-4 border-white">
            Tasks.
          </span>
        </h1>
        <p className="text-xl font-mono text-gray-300 mb-10">
          A high-contrast, strictly-typed workflow engine designed for
          engineering teams.
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/dashboard">
            <TaskButton
              color="purple"
              className="text-xl py-4 px-8">
              Enter Portal
            </TaskButton>
          </Link>
          <a
            href="https://github.com/pd241008"
            target="_blank"
            rel="noreferrer">
            <TaskButton
              color="white"
              className="text-xl py-4 px-8">
              View GitHub
            </TaskButton>
          </a>
        </div>
      </div>
    </div>
  );
}
