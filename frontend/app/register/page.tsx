"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setLoggedInUser } from "@/utils/auth";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Normalize credentials
      const cleanData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        jobTitle: formData.jobTitle.trim() || "Team Member",
      };

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      const userData = await res.json();
      
      // Auto-login after registration
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
      <div className="bg-neo-card border-4 border-white p-10 max-w-md w-full shadow-neo-purple relative overflow-hidden group">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-neo-purple -mr-8 -mt-8 rotate-45 group-hover:bg-neo-cyan transition-colors" />

        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 font-display text-white">Join Us</h1>
        <p className="font-mono text-neo-purple text-xs font-bold uppercase mb-8 tracking-widest">New operative Registration</p>

        {error && (
          <div className="bg-red-500 text-white font-black p-4 border-2 border-white mb-6 uppercase text-sm">
            Access Denied: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400">Full Name</label>
            <input
              required
              type="text"
              placeholder="E.g. John Doe"
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
              placeholder="operative@taskie.corp"
              className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-neo-purple outline-none transition-all focus:shadow-neo-purple"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400">Job Title</label>
            <input
              type="text"
              placeholder="E.g. Senior Developer"
              className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-neo-purple outline-none transition-all focus:shadow-neo-purple"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400">Security Key (Password)</label>
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
            className="w-full bg-neo-purple text-white font-black py-4 border-2 border-white shadow-neo-cyan hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 disabled:opacity-50">
            {loading ? "INITIALIZING..." : "COMMENCE ONBOARDING"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-gray-800 text-center">
          <p className="text-gray-400 text-xs uppercase font-mono tracking-widest">
            Already authorized?{" "}
            <Link href="/login" className="text-neo-purple hover:text-white underline decoration-2 underline-offset-4">
              Return to Port
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
