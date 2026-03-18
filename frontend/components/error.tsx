"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
      <h1 className="text-5xl font-black text-neo-pink uppercase">
        System Failure
      </h1>

      <p className="text-gray-400 font-mono">
        {error.message || "Something broke internally"}
      </p>

      <button
        onClick={reset}
        className="bg-neo-cyan text-black px-6 py-3 font-bold uppercase border-2 border-white hover:bg-white">
        Retry
      </button>
    </div>
  );
}
