"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    jobTitle: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const jobTitles = [
    "Developer",
    "Tech Lead",
    "Product Manager",
    "Designer",
    "QA Engineer",
    "President",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neo-bg p-6">
      <div className="bg-neo-card border-4 border-white p-10 max-w-md w-full shadow-neo-purple relative overflow-hidden group">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-neo-purple -mr-8 -mt-8 rotate-45 group-hover:bg-neo-cyan transition-colors" />

        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 font-display">Join Us</h1>
        <p className="font-mono text-neo-purple text-xs font-bold uppercase mb-8 tracking-widest">Initialization Phase</p>

        {error && (
          <div className="bg-red-500 text-white font-black p-4 border-2 border-white mb-6 uppercase text-sm">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400">Full Name</label>
            <input
              required
              className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-neo-purple outline-none transition-all focus:shadow-neo-purple"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400">Email Address</label>
            <input
              required
              type="email"
              className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-neo-purple outline-none transition-all focus:shadow-neo-purple"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400">Job Title</label>
            <select
              required
              className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-neo-purple outline-none transition-all appearance-none"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}>
              <option value="" disabled>Select Position...</option>
              {jobTitles.map((title) => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400">Password</label>
            <input
              required
              type="password"
              className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-neo-purple outline-none transition-all focus:shadow-neo-purple"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neo-purple text-black font-black py-4 border-2 border-white shadow-neo-cyan hover:bg-white transition-all transform hover:-translate-y-1 disabled:opacity-50">
            {loading ? "PROCESSING..." : "REGISTER ACCOUNT"}
          </button>
        </form>

        <p className="mt-8 text-center font-mono text-xs uppercase text-gray-500">
          Already a member? <Link href="/login" className="text-neo-cyan font-bold hover:underline">Entry Port</Link>
        </p>
      </div>
    </div>
  );
}
