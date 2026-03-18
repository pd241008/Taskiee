export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-black uppercase tracking-widest animate-pulse text-neo-cyan">
        TASKIEE
      </h1>
      <p className="mt-4 font-mono text-gray-400">Booting Workspace...</p>
    </div>
  );
}
