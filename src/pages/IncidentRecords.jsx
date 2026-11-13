// src/pages/IncidentRecords.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  RefreshCw,
  Clock,
  Download,
  Eye,
  Car,
  Calendar,
  MapPin,
  FileText,
  Shield,
  Palette,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { Card, Table, Button, Input, Select, Badge, Modal } from '../components/ui';
import { getIncidents } from '../services/incidentService';
import { useAuth } from '../context/AuthContext';

function IncidentRecords() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOffence, setSelectedOffence] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [activeRecord, setActiveRecord] = useState(null);

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

  // Distinct vehicle types for the filter dropdown
  const vehicleTypeOptions = Array.from(
    new Set(incidents.map((i) => i.vehicleType).filter(Boolean))
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
    const matchesVehicleType =
      !selectedVehicleType || row.vehicleType === selectedVehicleType;
    return matchesSearch && matchesOffence && matchesVehicleType;
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
    {
      label: 'Action',
      key: 'action',
      align: 'center',
      render: (_, row) => (
        <Button
          variant="secondary"
          size="sm"
          icon={Eye}
          onClick={(e) => {
            e.stopPropagation();
            setActiveRecord(row);
          }}
          className="text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-800"
        >
          View
        </Button>
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
        <div className="flex flex-col md:flex-row items-center gap-3 mb-5">
          <div className="w-full md:w-72">
            <Input
              icon={Search}
              placeholder="Search plate, make, model, color, time..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full md:w-52">
            <Select
              placeholder="All Offence Types"
              value={selectedOffence}
              onChange={(e) => setSelectedOffence(e.target.value)}
              options={offenceOptions.map((o) => ({ value: o, label: o }))}
            />
          </div>

          <div className="w-full md:w-44">
            <Select
              placeholder="All Vehicle Types"
              value={selectedVehicleType}
              onChange={(e) => setSelectedVehicleType(e.target.value)}
              options={vehicleTypeOptions.map((v) => ({ value: v, label: v }))}
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 md:ml-auto">
            Showing <strong className="text-emerald-800 font-bold">{filtered.length}</strong> recorded incident{filtered.length === 1 ? '' : 's'}
          </div>
        </div>

        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          onRowClick={(row) => setActiveRecord(row)}
          emptyMessage="No incidents match the search criteria. Click 'Register Incident' to log a new traffic violation."
        />
      </Card>

      {/* Detailed Incident Record Inspection Modal */}
      {activeRecord && (
        <Modal
          isOpen={Boolean(activeRecord)}
          onClose={() => setActiveRecord(null)}
          title="Incident Record Details"
          subtitle={`Incident Reference: ${activeRecord.id || activeRecord.reference_number || 'N/A'}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 font-mono">
                System Time & Date Certified
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveRecord(null)}
              >
                Close Record
              </Button>
            </div>
          }
        >
          <div className="space-y-5 py-2">
            {/* Top Highlight Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Vehicle Plate / Body Number
                </span>
                <p className="text-2xl font-black font-mono text-emerald-950 mt-0.5 tracking-wider">
                  {activeRecord.vehiclePlate || '—'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-emerald-900 border border-emerald-300 shadow-2xs">
                  {activeRecord.vehicleType || 'Car'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-800 text-white shadow-2xs">
                  {activeRecord.offenceType || 'Violation'}
                </span>
              </div>
            </div>

            {/* Vehicle Specifics Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Car size={14} className="text-emerald-700" />
                Vehicle Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Vehicle Make
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {activeRecord.vehicleMake && activeRecord.vehicleMake !== 'Standard'
                      ? activeRecord.vehicleMake
                      : '—'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Vehicle Model
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {activeRecord.vehicleModel && activeRecord.vehicleModel !== 'Standard'
                      ? activeRecord.vehicleModel
                      : '—'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Vehicle Color
                  </span>
                  <span className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2">
                    {activeRecord.vehicleColor &&
                      activeRecord.vehicleColor !== 'Standard' &&
                      activeRecord.vehicleColor !== '—' && (
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300 inline-block"
                          style={{
                            backgroundColor:
                              activeRecord.vehicleColor.toLowerCase() === 'white'
                                ? '#ffffff'
                                : activeRecord.vehicleColor.toLowerCase() === 'black'
                                ? '#111827'
                                : activeRecord.vehicleColor.toLowerCase() === 'silver' ||
                                  activeRecord.vehicleColor.toLowerCase() === 'grey'
                                ? '#9ca3af'
                                : activeRecord.vehicleColor.toLowerCase() === 'red' ||
                                  activeRecord.vehicleColor.toLowerCase() === 'maroon'
                                ? '#dc2626'
                                : activeRecord.vehicleColor.toLowerCase() === 'blue'
                                ? '#2563eb'
                                : activeRecord.vehicleColor.toLowerCase() === 'green'
                                ? '#16a34a'
                                : activeRecord.vehicleColor.toLowerCase() === 'yellow' ||
                                  activeRecord.vehicleColor.toLowerCase() === 'gold'
                                ? '#eab308'
                                : '#cbd5e1',
                          }}
                        />
                      )}
                    {activeRecord.vehicleColor && activeRecord.vehicleColor !== 'Standard'
                      ? activeRecord.vehicleColor
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Timing & Location Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-700" />
                Time, Date & Location
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Time (System Captured)
                  </span>
                  <span className="font-mono text-sm font-bold text-emerald-800">
                    {activeRecord.time || '—'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Date (System Captured)
                  </span>
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    {activeRecord.date || '—'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Location Sector
                  </span>
                  <span
                    className="text-sm font-semibold text-slate-800 truncate block"
                    title={activeRecord.location}
                  >
                    {activeRecord.location || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description / Circumstances */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Description / Circumstances
              </span>
              <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                {activeRecord.description || 'No additional officer remarks recorded.'}
              </p>
            </div>

            {/* Recorded By Officer */}
            {activeRecord.registered_by && (
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-medium">
                  <Shield size={14} className="text-emerald-700" />
                  Recorded By:
                </span>
                <span className="font-semibold text-slate-800">
                  {activeRecord.registered_by}
                </span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default IncidentRecords;
