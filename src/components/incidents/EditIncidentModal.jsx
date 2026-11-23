// src/components/incidents/EditIncidentModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Car,
  FileText,
  AlertCircle,
  Check,
  X,
  Clock,
  Calendar,
  MapPin,
  Shield,
  Palette,
  Hash,
} from 'lucide-react';
import { Modal, Button, Input, Select, SearchableSelect } from '../ui';
import { updateIncident } from '../../services/incidentService';
import { NIGERIAN_STATES } from '../../constants/states';

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

const VEHICLE_TYPES = [
  { value: 'Car', label: 'Car' },
  { value: 'Motorcycle', label: 'Motorcycle' },
  { value: 'Trailer', label: 'Trailer' },
  { value: 'Truck', label: 'Truck' },
  { value: 'Bus', label: 'Bus' },
  { value: 'Tricycle', label: 'Tricycle' },
];

const VEHICLE_COLORS = [
  { value: 'Black', label: 'Black' },
  { value: 'White', label: 'White' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Grey', label: 'Grey' },
  { value: 'Red', label: 'Red' },
  { value: 'Blue', label: 'Blue' },
  { value: 'Green', label: 'Green' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'Orange', label: 'Orange' },
  { value: 'Brown', label: 'Brown' },
  { value: 'Gold', label: 'Gold' },
  { value: 'Maroon', label: 'Maroon' },
];

export default function EditIncidentModal({ isOpen, onClose, incident, onSave }) {
  const [formData, setFormData] = useState({
    vehiclePlate: '',
    bodyNumber: '',
    vehicleType: 'Car',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    offenceType: '',
    location: '',
    stateRegistered: '',
    date: '',
    time: '',
    description: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (incident) {
      setFormData({
        vehiclePlate: incident.vehiclePlate || incident.plate_number || '',
        bodyNumber: incident.bodyNumber && incident.bodyNumber !== '—' ? incident.bodyNumber : '',
        vehicleType: incident.vehicleType || incident.vehicle_type || 'Car',
        vehicleMake: incident.vehicleMake && incident.vehicleMake !== 'Standard' && incident.vehicleMake !== '—' ? incident.vehicleMake : '',
        vehicleModel: incident.vehicleModel && incident.vehicleModel !== 'Standard' && incident.vehicleModel !== '—' ? incident.vehicleModel : '',
        vehicleColor: incident.vehicleColor && incident.vehicleColor !== 'Standard' && incident.vehicleColor !== '—' ? incident.vehicleColor : '',
        offenceType: incident.offenceType || incident.offences?.[0]?.title || 'Traffic Violation',
        location: incident.location || incident.manual_location || '',
        stateRegistered: incident.stateRegistered && incident.stateRegistered !== '—' ? incident.stateRegistered : '',
        date: incident.date || '',
        time: incident.time || '',
        description: incident.description && incident.description !== '—' ? incident.description : (incident.remarks || ''),
      });
      setError(null);
    }
  }, [incident, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehiclePlate.trim()) {
      setError('Vehicle plate number is required.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Location / sector is required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const recordId = incident.id || incident.reference_number;
      const res = await updateIncident(recordId, formData);
      const updated = res.data || { ...incident, ...formData };
      if (onSave) {
        onSave(updated);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update incident', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to update incident record. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !incident) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Incident Record"
      subtitle={`Editing Reference: ${incident.reference_number || incident.id || 'N/A'}`}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Check}
            onClick={handleSubmit}
            loading={saving}
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Vehicle Information */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Car size={15} className="text-emerald-700" />
            Vehicle Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Plate Number <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. KJA-482-AA"
                value={formData.vehiclePlate}
                onChange={(e) => handleChange('vehiclePlate', e.target.value.toUpperCase())}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                MOT / Body Number
              </label>
              <Input
                placeholder="e.g. BD-101"
                value={formData.bodyNumber}
                onChange={(e) => handleChange('bodyNumber', e.target.value.toUpperCase())}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Type
              </label>
              <Select
                value={formData.vehicleType}
                onChange={(e) => handleChange('vehicleType', e.target.value)}
                options={VEHICLE_TYPES}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Color
              </label>
              <Select
                value={formData.vehicleColor}
                onChange={(e) => handleChange('vehicleColor', e.target.value)}
                options={[{ value: '', label: 'Select or Standard' }, ...VEHICLE_COLORS]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Make
              </label>
              <Input
                placeholder="e.g. Toyota, Mercedes, Honda"
                value={formData.vehicleMake}
                onChange={(e) => handleChange('vehicleMake', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Model
              </label>
              <Input
                placeholder="e.g. Camry, Actros, Corolla"
                value={formData.vehicleModel}
                onChange={(e) => handleChange('vehicleModel', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Offence & Location */}
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Shield size={15} className="text-emerald-700" />
            Violation & Location
          </h4>
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Offence Classification <span className="text-rose-500">*</span>
              </label>
              <SearchableSelect
                placeholder="Select Offence Type..."
                searchPlaceholder="Search offences..."
                value={formData.offenceType}
                onChange={(val) => handleChange('offenceType', val)}
                options={OFFENCE_TYPES}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Sector / Junction <span className="text-rose-500">*</span>
                </label>
                <Input
                  icon={MapPin}
                  placeholder="e.g. Lekki-Epe Expressway Km 14"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State Registered
                </label>
                <SearchableSelect
                  placeholder="Select State..."
                  searchPlaceholder="Search states..."
                  value={formData.stateRegistered}
                  onChange={(val) => handleChange('stateRegistered', val)}
                  options={NIGERIAN_STATES}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Incident Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Incident Time
                </label>
                <input
                  type="time"
                  step="1"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Officer Remarks / Circumstances */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Officer Remarks / Incident Circumstances
          </label>
          <textarea
            rows={3}
            placeholder="Add relevant incident details, road conditions, or offender remarks..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition resize-none"
          />
        </div>
      </form>
    </Modal>
  );
}
