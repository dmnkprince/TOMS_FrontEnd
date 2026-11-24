import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FilePlus2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Car,
  Clock,
  MapPin,
  Calendar,
  FileText,
  Sparkles,
  Palette,
  Wrench,
  Hash,
} from 'lucide-react';
import { createIncident } from '../services/incidentService';
import { Button, SearchableSelect } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { NIGERIAN_STATES } from '../constants/states';

//list of offences
const OFFENCE_TYPES = [
  'Ascertainment of weight violation',
  'Assaulting marshal on duty',
  'Caution sign violation',
  'Child restraint violation',
  'Child sitting position violation',
  'Construction area speed limit violation',
  'Dangerous driving',
  'Do not move violation',
  "Driver's licence violation",
  'Driving right-hand steering vehicle',
  'Driving under alcohol or drug influence',
  'Driving with expired/without spare tyre',
  'Driving with worn-out tyre',
  'Excessive smoke emission',
  'Failure to cover unstable materials',
  'Failure to fix red flag on projected load',
  'Failure to move over',
  'Failure to install speed limiting device',
  'Failure to report road crash',
  'Fire extinguisher violation',
  'Fleet operation violation',
  'Inadequate construction warning sign',
  'Instructors permit and training violation',
  'Latching and twist-locks violation',
  'Learners driving regulation violation',
  'Light/sign violation',
  'Obstructing marshal on duty',
  'Operating a vehicle with forged documents',
  'Operating mechanically deficient vehicle',
  'Other offences/violations',
  'Overloading',
  "Passengers' manifest violation",
  'Projected load in excess of prescribed limit',
  'Riding motorcycle without crash helmet',
  'Failure to install speed limiting device (commercial)',
  'Road marking violation',
  'Road obstruction',
  'Route violation',
  'School bus violation',
  'Seat belt violation',
  'Speed limit violation',
  'Unauthorised removal/tampering with road signs',
  'Under-age driving/riding (under 18 years)',
  'Use of phone while driving',
  'Use of sirens violation',
  'Vehicle identification tag violation',
  'Vehicle licence violation',
  'Vehicle mirror violation',
  'Vehicle number plate violation',
  'Vehicle windshield violation',
  'Wrongful overtaking',
];

const VEHICLE_TYPES = ['Car', 'Motorcycle', 'Trailer', 'Truck', 'Bus', 'Tricycle'];

const VEHICLE_COLORS = [
  'Black', 'White', 'Silver', 'Grey', 'Red', 'Blue', 'Green',
  'Yellow', 'Orange', 'Brown', 'Gold', 'Maroon',
];

function getSystemDateTime() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return {
    date: `${yyyy}-${mm}-${dd}`,
    time: `${hh}:${min}`,
  };
}

function IncidentRegister() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialClock = getSystemDateTime();

  const [form, setForm] = useState({
    vehiclePlate: '',
    bodyNumber: '',
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    offenceType: '',
    otherOffence: '',
    location: '',
    date: initialClock.date,
    time: initialClock.time,
    description: '',
    stateRegistered: '',
    videoFileName: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastPlate, setLastPlate] = useState('');
  const [error, setError] = useState(null);

  // Date and Time are now editable fields using native inputs.
// Users can manually select a date via the calendar picker and a time via the time picker.

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!form.vehiclePlate.trim()) {
        throw new Error('Vehicle Plate Number is required.');
      }
      if (!form.offenceType) {
        throw new Error('Please select an Offence Type.');
      }

      // Capture exact system time at moment of submission
      const exactSystemClock = getSystemDateTime();
      const finalOffence =
        form.offenceType === 'Others' && form.otherOffence?.trim()
          ? `Others (${form.otherOffence.trim()})`
          : form.offenceType;

      const payload = {
        ...form,
        offenceType: finalOffence,
        date: exactSystemClock.date,
        time: exactSystemClock.time,
      };

      await createIncident(payload, user);

      setLastPlate(form.vehiclePlate.toUpperCase());
      setSubmitted(true);
      setForm({
        vehiclePlate: '',
        bodyNumber: '',
        vehicleType: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleColor: '',
        offenceType: '',
        otherOffence: '',
        location: '',
        date: exactSystemClock.date,
        time: exactSystemClock.time,
        description: '',
        stateRegistered: '',
        videoFileName: '',
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
            Capture vehicle violation details directly onto the traffic Offence registry.
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
                Violation record for plate <strong className="font-mono">{lastPlate}</strong> has been logged and is immediately visible in Incident Records.
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
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-8 space-y-5 sm:space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Violation & Vehicle Specifics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the vehicle and offence details below.
            </p>
          </div>
          
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
   {/* State Registered (Searchable Dropdown) */}
        <div>
          <SearchableSelect
            label="State Registered"
            icon={MapPin}
            options={NIGERIAN_STATES}
            value={form.stateRegistered}
            onChange={(val) => setForm((prev) => ({ ...prev, stateRegistered: val }))}
            placeholder="Select registered state..."
            searchPlaceholder="Type to search state (e.g. Lagos, Abuja, Rivers)..."
          />
        </div>
		
		 {/* Vehicle Plate Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Car size={14} className="text-emerald-700" />
              Vehicle Plate Number <span className="text-emerald-700">*</span>
            </label>
            <input
              name="vehiclePlate"
              value={form.vehiclePlate}
              onChange={handleChange}
              placeholder="e.g. KJA-482AA"
              required
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm uppercase font-mono bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            />
          </div>
		

          {/* Body Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Hash size={14} className="text-emerald-700" />
              Body Number
            </label>
            <input
              name="bodyNumber"
              value={form.bodyNumber}
              onChange={handleChange}
              placeholder="e.g. MOT-2001"
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

          {/* Vehicle Make */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Wrench size={14} className="text-emerald-700" />
              Vehicle Make
            </label>
            <input
              name="vehicleMake"
              value={form.vehicleMake}
              onChange={handleChange}
              placeholder="e.g. Toyota, Honda, Kia, etc."
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            />
          </div>

          {/* Vehicle Model */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Car size={14} className="text-emerald-700" />
              Vehicle Model
            </label>
            <input
              name="vehicleModel"
              value={form.vehicleModel}
              onChange={handleChange}
              placeholder="e.g. Camry, Corolla, Hilux"
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            />
          </div>

          {/* Vehicle Cor */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Palette size={14} className="text-emerald-700" />
              Vehicle Color
            </label>
            <select
              name="vehicleColor"
              value={form.vehicleColor}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            >
              <option value="">Select color...</option>
              {VEHICLE_COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Time (Captured automatically from system time) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-700" />
                Time 
				</label>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {/* optional system‑time hint */}
              </span>
            </div>
            <div className="relative">
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
              />

            </div>
          
          </div>

          {/* Date (Captured automatically from system date) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-700" />
                Date 
              </label>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                
              </span>
            </div>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
            />
                   </div>

          {/* Offence Type (Searchable Dropdown) */}
          <div>
            <SearchableSelect
              label="Offence Type"
              required
              options={OFFENCE_TYPES}
              value={form.offenceType}
              onChange={(val) => setForm((prev) => ({ ...prev, offenceType: val }))}
              placeholder="Select violation code..."
              searchPlaceholder="Type to search violation..."
            />

            {form.offenceType === 'Others' && (
              <div className="mt-2 animate-in fade-in">
                <input
                  name="otherOffence"
                  value={form.otherOffence}
                  onChange={handleChange}
                  placeholder="Specify violation name"
                  className="w-full border border-emerald-300 rounded-lg px-3 py-2 text-xs bg-emerald-50/40 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600"
                />
              </div>
            )}
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
              placeholder="e.g. Tombia Round About, or Berdger Junction"
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

       

        {/* Video File Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FileText size={14} className="text-emerald-700" />
            Video File Name
          </label>
          <input
            name="videoFileName"
            value={form.videoFileName}
            onChange={handleChange}
            placeholder="e.g. incident123.mp4"
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full sm:w-auto px-8 font-bold text-base shadow-md shadow-emerald-900/20 py-3"
          >
            Submit Incident
          </Button>
          <Link to="/incidents" className="w-full sm:w-auto">
            <Button type="button" variant="secondary" size="lg" className="w-full sm:w-auto py-3">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default IncidentRegister;
