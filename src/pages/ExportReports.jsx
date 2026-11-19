// src/pages/ExportReports.jsx
import React, { useState } from "react";

function ExportReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
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
    try {
      // Build the API base URL – VITE_API_BASE_URL may already contain '/api/v1'
      let base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
      if (!base.endsWith('/api/v1')) {
        base = `${base}/api/v1`;
      }
      const url = `${base}/auth/export/incidents`;

      // *** Use 'toms_token' – that's the key AuthContext stores the JWT under ***
      const authToken = localStorage.getItem('toms_token');

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
      const disposition = response.headers.get('Content-Disposition');
      let filename = 'incident_reports.xlsx';
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/"/g, '').trim();
      }
      downloadBlob(blob, filename);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Export All Reports</h2>
      <p className="mb-4 text-emerald-200/80">
        Download a spreadsheet with all traffic-offence records. Only admins or supervisors can access this page.
      </p>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Downloading...' : 'Download Reports'}
      </button>
      {error && <p className="mt-2 text-red-400">Error: {error}</p>}
    </div>
  );
}

export default ExportReports;
