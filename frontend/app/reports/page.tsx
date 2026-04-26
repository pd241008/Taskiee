"use client";

import { useState, useEffect, useRef } from "react";
import { TaskCard } from "@/components/ui/TaskCard";
import { ReportTable } from "@/components/ui/ReportTable";
import { Project, TaskStatus } from "@/types/tasks";

// Custom dynamic import for html2pdf
const exportToPdf = async (element: HTMLElement) => {
  try {
    // Robust dynamic import for html2pdf.js
    const html2pdf = (await import("html2pdf.js" as any)).default;
    
    if (!html2pdf) {
      throw new Error("html2pdf library not found");
    }

    const opt = {
      margin: [10, 10],
      filename: `Taskiee_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: "#0A0A0B",
        logging: false 
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    // Chaining correctly
    await html2pdf().from(element).set(opt).save();
  } catch (err: any) {
    console.error("PDF Export Error:", err);
    alert(`Failed to export PDF: ${err.message || "Unknown error"}`);
  }
};

import { getLoggedInUser } from "@/utils/auth";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    projectId: "",
    status: "",
  });

  const reportRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const statuses = [
    "Pending",
    "Backlog",
    "Todo",
    "In Progress",
    "In Review",
    "Blocked",
    "Done",
  ];

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setCurrentUserId(user._id);
    fetchInitialData(user._id);
  }, []);

  const fetchInitialData = async (userId: string) => {
    try {
      setLoading(true);
      const projRes = await fetch(`${API_URL}/api/projects`, {
        headers: { "x-user-id": userId },
      });
      if (projRes.ok) {
        const data = await projRes.json();
        setProjects(data);
      }
      await fetchReport(userId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async (userId?: string) => {
    try {
      const activeId = userId || currentUserId;
      if (!activeId) return;

      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (filters.projectId) queryParams.append("projectId", filters.projectId);
      if (filters.status) queryParams.append("status", filters.status);

      const res = await fetch(`${API_URL}/api/reports?${queryParams.toString()}`, {
        headers: { "x-user-id": activeId },
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };

  const handleExport = () => {
    if (reportRef.current) {
      exportToPdf(reportRef.current);
    }
  };

  if (loading && !reportData) {
    return <div className="p-10 text-center font-black animate-pulse">GENERATING ANALYTICS...</div>;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12 border-b-8 border-white pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">Reports Hub</h1>
          <p className="font-mono text-neo-cyan font-bold uppercase">Generate, Analyze & Export Metrics</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-neo-green text-black px-6 py-3 font-black border-2 border-white shadow-neo-white hover:bg-white transition-all transform hover:-translate-y-1">
          EXPORT PDF
        </button>
      </header>

      {/* Filter Bar */}
      <section className="bg-neo-card border-2 border-white p-6 shadow-neo-purple mb-12">
        <form onSubmit={handleApplyFilters} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-gray-400">From Date</label>
            <input
              type="date"
              className="bg-black border-2 border-gray-700 p-2 text-white focus:border-neo-purple outline-none"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-gray-400">To Date</label>
            <input
              type="date"
              className="bg-black border-2 border-gray-700 p-2 text-white focus:border-neo-purple outline-none"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-gray-400">Project</label>
            <select
              className="bg-black border-2 border-gray-700 p-2 text-white focus:border-neo-purple outline-none appearance-none"
              value={filters.projectId}
              onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}>
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-gray-400">Status</label>
            <select
              className="bg-black border-2 border-gray-700 p-2 text-white focus:border-neo-purple outline-none appearance-none"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-neo-purple text-black py-3 font-black border-2 border-white shadow-neo-cyan hover:bg-white transition-all transform hover:-translate-y-1">
            APPLY FILTERS
          </button>
        </form>
      </section>

      {/* Report Content for PDF */}
      <div ref={reportRef} className="p-4 bg-neo-bg">
        <div className="report-header hidden print:block mb-8">
          <h2 style={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'underline', fontSize: '2.25rem' }}>Taskiee Activity Report</h2>
          <p style={{ color: '#9ca3af' }}>Generated on {new Date().toLocaleString()}</p>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Total Filtered Tasks Card */}
          <div style={{ backgroundColor: '#151518', border: '2px solid white', padding: '1.5rem', boxShadow: '6px 6px 0px 0px #A855F7' }} className="flex flex-col">
            <span className="text-xs font-black uppercase text-[#9ca3af] mb-2">Total Filtered Tasks</span>
            <span style={{ color: 'white' }} className="text-5xl font-black">{reportData?.tasks?.length || 0}</span>
          </div>
          
          {/* Status Breakdown Card */}
          <div style={{ backgroundColor: '#151518', border: '2px solid white', padding: '1.5rem', boxShadow: '6px 6px 0px 0px #A3E635' }} className="flex flex-col">
            <span className="text-xs font-black uppercase text-[#9ca3af] mb-2">Status Breakdown</span>
            <div className="space-y-1 mt-2">
              {reportData?.statusSummary?.map((s: any) => (
                <div key={s._id} style={{ borderBottom: '1px solid #1f2937' }} className="flex justify-between font-mono text-sm">
                  <span style={{ color: 'white' }}>{s._id}</span>
                  <span style={{ color: '#A3E635' }} className="font-black">{s.count}</span>
                </div>
              ))}
              {reportData?.statusSummary?.length === 0 && <span className="italic text-[#6b7280] text-sm">No data</span>}
            </div>
          </div>

          {/* Priority Breakdown Card */}
          <div style={{ backgroundColor: '#151518', border: '2px solid white', padding: '1.5rem', boxShadow: '6px 6px 0px 0px #FACC15' }} className="flex flex-col">
            <span className="text-xs font-black uppercase text-[#9ca3af] mb-2">Priority Breakdown</span>
            <div className="space-y-1 mt-2">
              {reportData?.prioritySummary?.map((p: any) => (
                <div key={p._id} style={{ borderBottom: '1px solid #1f2937' }} className="flex justify-between font-mono text-sm text-white">
                  <span>{p._id}</span>
                  <span style={{ color: '#FACC15' }} className="font-black">{p.count}</span>
                </div>
              ))}
              {reportData?.prioritySummary?.length === 0 && <span className="italic text-[#6b7280] text-sm">No data</span>}
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <h2 className="text-3xl font-black uppercase mb-4 text-neo-cyan">Detailed Breakdown</h2>
        <ReportTable tasks={reportData?.tasks || []} />
      </div>
    </div>
  );
}
