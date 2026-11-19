// src/pages/ExportReports.jsx
import React, { useState } from "react";
import {
  FileSpreadsheet,
  Calendar,
  Download,
  Filter,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, Button } from "../components/ui";

function ExportReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Quick preset helper
  const applyPreset = (preset) => {
    const today = new Date();
    const formatDate = (d) => d.toISOString().split("T")[0];

    setError(null);
    setSuccessMsg(null);

    if (preset === "all") {
      setStartDate("");
      setEndDate("");
      return;
    }

    if (preset === "today") {
      const todayStr = formatDate(today);
      setStartDate(todayStr);
      setEndDate(todayStr);
      return;
    }

    if (preset === "7days") {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      setStartDate(formatDate(past));
      setEndDate(formatDate(today));
      return;
    }

    if (preset === "30days") {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      setStartDate(formatDate(past));
      setEndDate(formatDate(today));
      return;
    }

    if (preset === "thisMonth") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(formatDate(firstDay));
      setEndDate(formatDate(today));
      return;
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Validate date order if both are set
    if (startDate && endDate && startDate > endDate) {
      setError("Start date cannot be later than end date.");
      setLoading(false);
      return;
    }

    try {
      let base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
      if (!base.endsWith("/api/v1")) {
        base = `${base}/api/v1`;
      }

      // Build query params
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const queryString = params.toString();
      const url = `${base}/auth/export/incidents${queryString ? `?${queryString}` : ""}`;

      const authToken = localStorage.getItem("toms_token");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(`Server responded ${response.status}: ${msg}`);
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      let filename = "incident_reports.xlsx";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      downloadBlob(blob, filename);
      setSuccessMsg(`Report successfully downloaded as "${filename}"`);
    } catch (err) {
      console.error("Export error:", err);
      setError(err.message || "Failed to download reports.");
    } finally {
      setLoading(false);
    }
  };

  const hasFilter = Boolean(startDate || endDate);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
            <FileSpreadsheet size={26} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Export Incident Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Generate and download traffic incident records as formatted Microsoft Excel (.xlsx) files.
            </p>
          </div>
        </div>
      </div>

      {/* Main Filter & Export Form */}
      <Card>
        <div className="space-y-6 p-2">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Quick Date Presets
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  !startDate && !endDate
                    ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => applyPreset("today")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => applyPreset("7days")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset("30days")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset("thisMonth")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
              >
                This Month
              </button>
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-700" />
                Start Date (From)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-700" />
                End Date (To)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>

            <div className="flex items-end">
              {hasFilter && (
                <button
                  type="button"
                  onClick={() => applyPreset("all")}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  <RotateCcw size={13} />
                  Reset Dates
                </button>
              )}
            </div>
          </div>

          {/* Active Range Preview Box */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-emerald-800 shrink-0" />
              <span className="text-xs font-medium text-emerald-950">
                Selected Scope:{" "}
                <strong className="font-bold text-emerald-900">
                  {startDate && endDate
                    ? `${startDate}  to  ${endDate}`
                    : startDate
                    ? `From ${startDate} onward`
                    : endDate
                    ? `Up to ${endDate}`
                    : "All Time (Complete Database Records)"}
                </strong>
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md font-semibold">
              Format: Excel (.xlsx)
            </span>
          </div>

          {/* Error & Success Feedback */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-in fade-in">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={Download}
              loading={loading}
              onClick={handleDownload}
              className="w-full sm:w-auto font-bold px-8 shadow-md shadow-emerald-900/20"
            >
              {loading ? "Generating Excel File..." : "Download Excel Report (.xlsx)"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ExportReports;
