// src/services/incidentService.js
import { apiClient } from './apiClient';

const STORAGE_KEY = 'toms_custom_incidents';

// Initial sample records with Time and Date automatically captured
const initialSampleIncidents = [
  {
    id: 'inc-seed-001',
    vehiclePlate: 'KJA-482-AA',
    vehicleType: 'Car',
    time: '10:45:12',
    offenceType: 'Speeding',
    location: 'Lekki-Epe Expressway Km 14',
    date: '2026-11-12',
    description: 'Vehicle clocked exceeding 60km/h zone at 94km/h.',
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  {
    id: 'inc-seed-002',
    vehiclePlate: 'ABJ-118-RBC',
    vehicleType: 'Truck',
    time: '14:20:00',
    offenceType: 'Running Red Light',
    location: 'Herbert Macaulay Junction, CBD',
    date: '2026-11-11',
    description: 'Vehicle failed to yield and crossed red traffic signal during high traffic.',
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    id: 'inc-seed-003',
    vehiclePlate: 'KND-771-AA',
    vehicleType: 'Bus',
    time: '08:35:40',
    offenceType: 'Using Phone While Driving',
    location: 'Kano Ring Road Interchange',
    date: '2026-11-10',
    description: 'Driver observed actively operating handheld cellular device while in motion.',
    created_at: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
  },
];

function getStoredIncidents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleIncidents));
      return initialSampleIncidents;
    }
    const parsed = JSON.parse(raw);
    // Ensure any previously stored items have a time field
    return parsed.map((item) => ({
      ...item,
      time: item.time || (item.created_at ? new Date(item.created_at).toLocaleTimeString('en-GB') : '11:00:00'),
    }));
  } catch (e) {
    return initialSampleIncidents;
  }
}

function saveStoredIncidents(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save incidents to localStorage', e);
  }
}

export const getIncidents = async (params = {}) => {
  const localList = getStoredIncidents();

  try {
    const response = await apiClient.get('/incidents', { params });
    const data = response.data?.data || response.data || [];
    const serverIncidents = Array.isArray(data) ? data : data.incidents || [];

    // Map server incidents to the details captured on the register incident page
    const mappedServer = serverIncidents.map((s) => {
      const dt = s.incident_date ? new Date(s.incident_date) : new Date();
      const formattedTime = !isNaN(dt.getTime())
        ? dt.toLocaleTimeString('en-GB')
        : '12:00:00';
      const formattedDate = s.date || (s.incident_date ? s.incident_date.slice(0, 10) : '—');

      return {
        id: s.id || s.reference_number,
        vehiclePlate: s.plate_number || s.vehiclePlate || s.body_number || '—',
        vehicleType: s.vehicle_type || s.vehicleType || 'Car',
        time: s.time || formattedTime,
        offenceType:
          s.offences?.[0]?.title ||
          s.offences?.[0]?.category ||
          s.offenceType ||
          'Traffic Violation',
        location: s.manual_location || s.location || s.location_description || '—',
        date: formattedDate,
        description: s.remarks || s.description || '—',
        created_at: s.created_at || s.incident_date,
      };
    });

    // Merge without duplicates: local records take precedence
    const seenPlates = new Set();
    const merged = [];

    for (const item of [...localList, ...mappedServer]) {
      const key = `${item.vehiclePlate}_${item.date}_${item.time || ''}_${item.offenceType}`;
      if (!seenPlates.has(key)) {
        seenPlates.add(key);
        merged.push(item);
      }
    }

    return { data: merged };
  } catch (err) {
    console.warn('Backend unavailable, serving locally cached incidents', err);
    return { data: localList };
  }
};

export const createIncident = async (formData) => {
  const localList = getStoredIncidents();

  // Capture current system date and time automatically
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  const systemDate = `${yyyy}-${mm}-${dd}`;
  const systemTime = `${hh}:${min}:${ss}`;

  const newIncident = {
    id: 'inc-' + Date.now(),
    vehiclePlate: (formData.vehiclePlate || formData.plate_number || '').trim().toUpperCase(),
    vehicleType: formData.vehicleType || formData.vehicle_type || 'Car',
    time: formData.time || systemTime, // Automatically captured from system time
    offenceType: formData.offenceType || formData.offence || 'General Violation',
    location: (formData.location || formData.manual_location || '').trim() || 'Unspecified Sector',
    date: formData.date || systemDate, // Automatically captured from system date
    description: (formData.description || formData.remarks || '').trim() || '—',
    created_at: now.toISOString(),
  };

  // 1. Immediately store locally for instant presentation
  localList.unshift(newIncident);
  saveStoredIncidents(localList);

  // 2. Also dispatch to backend API
  try {
    let isoTimestamp;
    try {
      isoTimestamp = new Date(`${newIncident.date}T${newIncident.time}`).toISOString();
    } catch (e) {
      isoTimestamp = now.toISOString();
    }

    const payload = {
      plate_number: newIncident.vehiclePlate,
      vehicle_type: newIncident.vehicleType,
      vehicle_make: 'Standard',
      vehicle_model: newIncident.vehicleType,
      vehicle_color: 'Standard',
      manual_location: newIncident.location,
      time: newIncident.time,
      date: newIncident.date,
      incident_date: isoTimestamp,
      remarks: newIncident.description,
      offences: [
        {
          offence_type_id: 'off-spd-01',
          fine_amount: 15000,
          notes: newIncident.offenceType,
        },
      ],
    };
    await apiClient.post('/incidents', payload);
  } catch (err) {
    console.warn('Incident saved locally; backend push had error:', err.message);
  }

  return { data: newIncident };
};

export const getIncident = (id) => apiClient.get(`/incidents/${id}`);
export const updateIncident = (id, data) => apiClient.put(`/incidents/${id}`, data);
export const deleteIncident = (id) => apiClient.delete(`/incidents/${id}`);
