// src/pages/IncidentRecords.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FileSpreadsheet, RefreshCw, Car } from 'lucide-react';
import { Card, Table, Button, Input, Select, Badge } from '../components/ui';
import { getIncidents } from '../services/incidentService';

function IncidentRecords() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOffence, setSelectedOffence] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getIncidents();
      const list = res.data || [];
      setIncidents(list);
    } catch (err) {
      console.error('Failed to load incidents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Distinct offence types for the filter dropdown
  const offenceOptions = Array.from(
    new Set(incidents.map((i) => i.offenceType).filter(Boolean))
  );

  const filtered = incidents.filter((row) => {
    const term = search.toLowerCase();
    const matchesSearch =
      !search ||
      row.vehiclePlate?.toLowerCase().includes(term) ||
      row.driverName?.toLowerCase().includes(term) ||
      row.location?.toLowerCase().includes(term) ||
      row.offenceType?.toLowerCase().includes(term) ||
      row.description?.toLowerCase().includes(term);

    const matchesOffence = !selectedOffence || row.offenceType === selectedOffence;
    return matchesSearch && matchesOffence;
  });

  // Table columns displaying ONLY the details captured on the register incident page:
  // 1. Vehicle Plate / Body Number
  // 2. Vehicle Type
  // 3. Driver Name
  // 4. Offence Type
  // 5. Location
  // 6. Date
  // 7. Description / Notes
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
      label: 'Driver Name',
      key: 'driverName',
      render: (val) => (
        <span className="text-xs font-bold text-slate-900">
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
      label: 'Date',
      key: 'date',
      render: (val) => (
        <span className="font-mono text-xs text-slate-600">
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
                Displays verified traffic incident details captured by patrol officers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
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
              placeholder="Search plate, driver, location, offence..."
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
