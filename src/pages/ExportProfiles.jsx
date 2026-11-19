// src/pages/ExportProfiles.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function ExportProfiles() {
  const { token } = useAuth(); // assuming auth context provides JWT token
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/api/v1/auth/export/profiles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(`Server responded ${response.status}: ${msg}`);
      }
      const blob = await response.blob();
      // The backend sets Content-Disposition header with filename "profiles.json"
      const disposition = response.headers.get('Content-Disposition');
      let filename = 'profiles.json';
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
      <h2 className="text-xl font-bold mb-4">Export All Profiles</h2>
      <p className="mb-4 text-emerald-200/80">Download a JSON file containing all user profiles. Only admins can access this page.</p>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Downloading...' : 'Download Profiles'}
      </button>
      {error && <p className="mt-2 text-red-400">Error: {error}</p>}
    </div>
  );
}

export default ExportProfiles;
