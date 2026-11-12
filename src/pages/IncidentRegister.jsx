import React, { useState } from 'react';

const OFFENCE_TYPES = ['Speeding', 'Running Red Light', 'No Seatbelt', 'Drunk Driving', 'Illegal Parking', 'Using Phone While Driving'];
const VEHICLE_TYPES = ['Car', 'Motorcycle', 'Truck', 'Bus', 'Van'];

function IncidentRegister() {
  const [form, setForm] = useState({
    vehiclePlate: '', vehicleType: '', driverName: '',
    offenceType: '', location: '', date: '', description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with incidentService.createIncident(form)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ vehiclePlate: '', vehicleType: '', driverName: '', offenceType: '', location: '', date: '', description: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Register Incident</h2>
      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded px-4 py-2 mb-4">
          Incident registered successfully.
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Plate *</label>
            <input name="vehiclePlate" value={form.vehiclePlate} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select name="vehicleType" value={form.vehicleType} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select...</option>
              {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
            <input name="driverName" value={form.driverName} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offence Type *</label>
            <select name="offenceType" value={form.offenceType} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select...</option>
              {OFFENCE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition">
          Submit Incident
        </button>
      </form>
    </div>
  );
}

export default IncidentRegister;
