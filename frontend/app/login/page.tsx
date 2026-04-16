"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setLoggedInUser } from "@/utils/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const userData = await res.json();
      
      // Store user info in localStorage for mock auth
      setLoggedInUser(userData);
      
      router.push("/tasks"); 
      // Trigger a refresh to update layout/sidebar
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neo-bg p-6">
      <div className="bg-neo-card border-4 border-white p-10 max-w-md w-full shadow-neo-cyan relative overflow-hidden group">
        {/* Decorative corner */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-neo-cyan -ml-8 -mt-8 rotate-45 group-hover:bg-neo-purple transition-colors" />

        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 font-display">Log In</h1>
        <p className="font-mono text-neo-cyan text-xs font-bold uppercase mb-8 tracking-widest">Access Port Authorization</p>

        {error && (
          <div className="bg-red-500 text-white font-black p-4 border-2 border-white mb-6 uppercase text-sm">
            Access Denied: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400">Email Address</label>
            <input
              required
              type="email"
              className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-neo-cyan outline-none transition-all focus:shadow-neo-cyan"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400">Security Key (Password)</label>
            <input
              required
              type="password"
              className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-neo-cyan outline-none transition-all focus:shadow-neo-cyan"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neo-cyan text-black font-black py-4 border-2 border-white shadow-neo-purple hover:bg-white transition-all transform hover:-translate-y-1 disabled:opacity-50">
            {loading ? "AUTHORIZING..." : "INITIATE SESSION"}
          </button>
        </form>

        <p className="mt-8 text-center font-mono text-xs uppercase text-gray-500">
          New system user? <Link href="/register" className="text-neo-purple font-bold hover:underline">Request Access</Link>
        </p>
      </div>
    </div>
  );
}
