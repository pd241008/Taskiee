"use client";

import { useState, FormEvent } from "react";

/* ================= TYPES ================= */

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTeamUpdated: () => void; // Matches the prop passed from page.tsx
  apiUrl: string; // Ensures dynamic routing works in production
  adminId: string;
  currentUserRole: string;
}

/* ================= COMPONENT ================= */

export default function ManageTeamModal({
  isOpen,
  onClose,
  onTeamUpdated,
  apiUrl,
  adminId,
  currentUserRole,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    jobTitle: "",
    accessLevel: "USER",
  });

  // Production UX States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(""); // Clear previous errors

    try {
      const res = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": adminId,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to create user. Please try again.");
      }

      onTeamUpdated(); // Triggers fetchData in page.tsx to refresh the board
      setForm({ name: "", email: "", jobTitle: "", accessLevel: "USER" }); // Reset form
      onClose(); // Close modal on success
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border-4 border-white p-8 w-full max-w-lg shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-neo-cyan">Add Member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl font-bold"
            aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Display error message if the API request fails */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-4 rounded text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 bg-black border-2 border-gray-600 text-white focus:border-neo-cyan outline-none transition-colors"
            required
            disabled={isSubmitting}
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 bg-black border-2 border-gray-600 text-white focus:border-neo-cyan outline-none transition-colors"
            required
            disabled={isSubmitting}
          />

          <input
            placeholder="Role (e.g. Developer)"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            className="w-full p-3 bg-black border-2 border-gray-600 text-white focus:border-neo-cyan outline-none transition-colors"
            required
            disabled={isSubmitting}
          />

          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-500 uppercase">Access Level</label>
            <select
              value={form.accessLevel}
              onChange={(e) => setForm({ ...form, accessLevel: e.target.value })}
              className="w-full p-3 bg-black border-2 border-gray-600 text-white focus:border-neo-cyan outline-none transition-colors"
              disabled={isSubmitting}
            >
              <option value="USER">USER (Standard Member)</option>
              {(currentUserRole === "ADMIN" || currentUserRole === "PRESIDENT") && (
                <option value="ADMIN">ADMIN (Task Manager)</option>
              )}
              {currentUserRole === "PRESIDENT" && (
                <option value="PRESIDENT">PRESIDENT (Full Access)</option>
              )}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-neo-cyan hover:bg-white text-black py-3 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? "Adding Member..." : "Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
}
