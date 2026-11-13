// src/pages/IncidentRecords.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FileSpreadsheet, RefreshCw, Clock, Download, Printer } from 'lucide-react';
import { Card, Table, Button, Input, Select, Badge } from '../components/ui';
import { getIncidents } from '../services/incidentService';
import { useAuth } from '../context/AuthContext';

function IncidentRecords() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOffence, setSelectedOffence] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getIncidents(user);
      const list = res.data || [];
      setIncidents(list);
    } catch (err) {
      console.error('Failed to load incidents', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!filtered || filtered.length === 0) return;
    const headers = [
      'Plate Number',
      'Vehicle Type',
      'Make',
      'Model',
      'Color',
      'Time',
      'Date',
      'Offence Type',
      'Location',
      'Description',
    ];
    const rows = filtered.map((r) => [
      `"${r.vehiclePlate || ''}"`,
      `"${r.vehicleType || ''}"`,
      `"${r.vehicleMake || ''}"`,
      `"${r.vehicleModel || ''}"`,
      `"${r.vehicleColor || ''}"`,
      `"${r.time || ''}"`,
      `"${r.date || ''}"`,
      `"${r.offenceType || ''}"`,
      `"${r.location || ''}"`,
      `"${(r.description || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `TOMS_Incident_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadData();
  }, [user?.id, user?.role]);

  // Distinct offence types for the filter dropdown
  const offenceOptions = Array.from(
    new Set(incidents.map((i) => i.offenceType).filter(Boolean))
  );

  const filtered = incidents.filter((row) => {
    const term = search.toLowerCase();
    const matchesSearch =
      !search ||
      row.vehiclePlate?.toLowerCase().includes(term) ||
      row.vehicleType?.toLowerCase().includes(term) ||
      row.vehicleMake?.toLowerCase().includes(term) ||
      row.vehicleModel?.toLowerCase().includes(term) ||
      row.vehicleColor?.toLowerCase().includes(term) ||
      row.time?.toLowerCase().includes(term) ||
      row.location?.toLowerCase().includes(term) ||
      row.offenceType?.toLowerCase().includes(term) ||
      row.date?.toLowerCase().includes(term) ||
      row.description?.toLowerCase().includes(term);

    const matchesOffence = !selectedOffence || row.offenceType === selectedOffence;
    return matchesSearch && matchesOffence;
  });

  // Table columns displaying the details captured on the register incident page:
  // 1. Vehicle Plate / Body Number
  // 2. Vehicle Type
  // 3. Make
  // 4. Model
  // 5. Color
  // 6. Time (auto-captured from system time)
  // 7. Date (auto-captured from system date)
  // 8. Offence Type
  // 9. Location
  // 10. Description / Notes
  const columns = [
    {
      label: 'Vehicle Plate / Body Number',
      key: 'vehiclePlate',
      render: (val) => (
        <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2.5 py-1 rounded-md tracking-wider">
          {val || '—'}
        </span>
      ),
    },
    {
      label: 'Vehicle Type',
      key: 'vehicleType',
      render: (val) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {val || 'Car'}
        </span>
      ),
    },
    {
      label: 'Make',
      key: 'vehicleMake',
      render: (val) => (
        <span className="text-xs font-medium text-slate-800">
          {val && val !== 'Standard' ? val : '—'}
        </span>
      ),
    },
    {
      label: 'Model',
      key: 'vehicleModel',
      render: (val) => (
        <span className="text-xs font-medium text-slate-800">
          {val && val !== 'Standard' ? val : '—'}
        </span>
      ),
    },
    {
      label: 'Color',
      key: 'vehicleColor',
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
          {val && val !== 'Standard' && val !== '—' && (
            <span
              className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
              style={{
                backgroundColor:
                  val.toLowerCase() === 'white'
                    ? '#ffffff'
                    : val.toLowerCase() === 'black'
                    ? '#111827'
                    : val.toLowerCase() === 'silver' || val.toLowerCase() === 'grey'
                    ? '#9ca3af'
                    : val.toLowerCase() === 'red' || val.toLowerCase() === 'maroon'
                    ? '#dc2626'
                    : val.toLowerCase() === 'blue'
                    ? '#2563eb'
                    : val.toLowerCase() === 'green'
                    ? '#16a34a'
                    : val.toLowerCase() === 'yellow' || val.toLowerCase() === 'gold'
                    ? '#eab308'
                    : '#cbd5e1',
              }}
            />
          )}
          {val && val !== 'Standard' ? val : '—'}
        </span>
      ),
    },
    {
      label: 'Time (System)',
      key: 'time',
      render: (val) => (
        <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50/60 px-2 py-0.5 rounded border border-emerald-200/50">
          {val || '—'}
        </span>
      ),
    },
    {
      label: 'Date (System)',
      key: 'date',
      render: (val) => (
        <span className="font-mono text-xs text-slate-600">
          {val || '—'}
        </span>
      ),
    },
    {
      label: 'Offence Type',
      key: 'offenceType',
      render: (val) => (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {val || 'Traffic Violation'}
        </span>
      ),
    },
    {
      label: 'Location',
      key: 'location',
      render: (val) => (
        <span className="text-xs text-slate-700">
          {val || '—'}
        </span>
      ),
    },
    {
      label: 'Description / Notes',
      key: 'description',
      render: (val) => (
        <span className="text-xs text-slate-600 line-clamp-2 max-w-xs" title={val}>
          {val || '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner - Dark Green & White Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Incident Records
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Displays verified traffic incident details. Date and time are automatically recorded from the system clock.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={handleExportCSV}
            title="Export incidents report to CSV"
          >
            Export Report
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={RefreshCw}
            onClick={loadData}
            loading={loading}
            title="Reload records"
          >
            Refresh
          </Button>

          <Link to="/incidents/register">
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              className="font-bold shadow-md shadow-emerald-900/20"
            >
              Register Incident
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Table Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
          <div className="w-full sm:w-80">
            <Input
              icon={Search}
              placeholder="Search plate, time, date, location, offence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-60">
            <Select
              placeholder="All Offence Types"
              value={selectedOffence}
              onChange={(e) => setSelectedOffence(e.target.value)}
              options={offenceOptions.map((o) => ({ value: o, label: o }))}
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 sm:ml-auto">
            Showing <strong className="text-emerald-800 font-bold">{filtered.length}</strong> recorded incident{filtered.length === 1 ? '' : 's'}
          </div>
        </div>

        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No incidents match the search criteria. Click 'Register Incident' to log a new traffic violation."
        />
      </Card>
    </div>
  );
}

export default IncidentRecords;
