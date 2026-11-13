import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FilePlus2, CheckCircle2, ArrowRight, ShieldAlert, Car, User, MapPin, Calendar, FileText } from 'lucide-react';
import { createIncident } from '../services/incidentService';
import { Button } from '../components/ui';

const OFFENCE_TYPES = [
  'Speeding',
  'Running Red Light',
  'No Seatbelt',
  'Drunk Driving',
  'Illegal Parking',
  'Using Phone While Driving',
  'Dangerous Driving',
  'Expired Driver License',
  'Overloading',
  'Driving Against Traffic',
];

const VEHICLE_TYPES = ['Car', 'Motorcycle', 'Trailer', 'Truck', 'Bus', 'Tricycle'];

function IncidentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    vehiclePlate: '',
    vehicleType: '',
    driverName: '',
    offenceType: '',
    location: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastPlate, setLastPlate] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!form.vehiclePlate.trim()) {
        throw new Error('Vehicle Plate / Body Number is required.');
      }
      if (!form.offenceType) {
        throw new Error('Please select an Offence Type.');
      }
      if (!form.date) {
        throw new Error('Incident Date is required.');
      }

      await createIncident(form);

      setLastPlate(form.vehiclePlate.toUpperCase());
      setSubmitted(true);
      setForm({
        vehiclePlate: '',
        vehicleType: '',
        driverName: '',
        offenceType: '',
        location: '',
        date: new Date().toISOString().slice(0, 10),
        description: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to register incident. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              <FilePlus2 size={20} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Register Incident
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture vehicle violation details directly onto the live traffic registry.
          </p>
        </div>

        <Link to="/incidents">
          <Button variant="outline" size="md">
            View All Incident Records
          </Button>
        </Link>
      </div>

      {/* Success Notification Banner */}
      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-700 shrink-0" />
            <div>
              <p className="font-bold text-sm text-emerald-900">
                Incident Registered Successfully!
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Violation record for plate <strong className="font-mono">{lastPlate}</strong> has been saved and is immediately available in Incident Records.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/incidents')}
              icon={ArrowRight}
            >
              Go to Records
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSubmitted(false)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert size={18} className="text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Incident Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">
            Violation & Vehicle Specifics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            All fields captured below will appear on the Incident Records terminal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Vehicle Plate */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Car size={14} className="text-emerald-700" />
              Vehicle Plate / Body Number <span className="text-emerald-700">*</span>
            </label>
            <input
              name="vehiclePlate"
              value={form.vehiclePlate}
              onChange={handleChange}
              placeholder="e.g. KJA-482-AA or CAB-92"
              required
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm uppercase font-mono bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            >
              <option value="">Select vehicle type...</option>
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Driver Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-emerald-700" />
              Driver Name
            </label>
            <input
              name="driverName"
              value={form.driverName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            />
          </div>

          {/* Offence Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Offence Type <span className="text-emerald-700">*</span>
            </label>
            <select
              name="offenceType"
              value={form.offenceType}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            >
              <option value="">Select violation code...</option>
              {OFFENCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-700" />
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Lekki Toll Plaza or Outer Ring Road"
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-emerald-700" />
              Incident Date <span className="text-emerald-700">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            />
          </div>
        </div>

        {/* Description / Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FileText size={14} className="text-emerald-700" />
            Description / Notes
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Additional context, circumstances, or officer observations..."
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
          />
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="px-8 font-bold shadow-md shadow-emerald-900/20"
          >
            Submit Incident
          </Button>
          <Link to="/incidents">
            <Button type="button" variant="secondary" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default IncidentRegister;
