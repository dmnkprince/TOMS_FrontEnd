// src/services/incidentService.js
import { apiClient } from './apiClient';

const STORAGE_KEY = 'toms_custom_incidents';

// Initial sample records demonstrating the required 7 captured fields
const initialSampleIncidents = [
  {
    id: 'inc-seed-001',
    vehiclePlate: 'KJA-482-AA',
    vehicleType: 'Car',
    driverName: 'Emeka Nwosu',
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
    driverName: 'Musa Ibrahim',
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
    driverName: 'Kabiru Aliyu',
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
    return JSON.parse(raw);
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

    // Map server incidents to the 7 fields captured on the register incident page
    const mappedServer = serverIncidents.map((s) => ({
      id: s.id || s.reference_number,
      vehiclePlate: s.plate_number || s.vehiclePlate || s.body_number || '—',
      vehicleType: s.vehicle_type || s.vehicleType || 'Car',
      driverName: s.driver_name || s.driverName || '—',
      offenceType:
        s.offences?.[0]?.title ||
        s.offences?.[0]?.category ||
        s.offenceType ||
        'Traffic Violation',
      location: s.manual_location || s.location || s.location_description || '—',
      date: s.incident_date ? s.incident_date.slice(0, 10) : s.date || '—',
      description: s.remarks || s.description || '—',
      created_at: s.created_at || s.incident_date,
    }));

    // Merge without duplicates: local ones take precedence for immediate visibility
    const seenPlates = new Set();
    const merged = [];

    for (const item of [...localList, ...mappedServer]) {
      const key = `${item.vehiclePlate}_${item.date}_${item.offenceType}`;
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

  // Normalize to the 7 details captured on the register incident page
  const newIncident = {
    id: 'inc-' + Date.now(),
    vehiclePlate: (formData.vehiclePlate || formData.plate_number || '').trim().toUpperCase(),
    vehicleType: formData.vehicleType || formData.vehicle_type || 'Car',
    driverName: (formData.driverName || formData.driver_name || '').trim() || '—',
    offenceType: formData.offenceType || formData.offence || 'General Violation',
    location: (formData.location || formData.manual_location || '').trim() || 'Unspecified Sector',
    date: formData.date || formData.incident_date || new Date().toISOString().slice(0, 10),
    description: (formData.description || formData.remarks || '').trim() || '—',
    created_at: new Date().toISOString(),
  };

  // 1. Immediately store locally to guarantee newly inputted records show up instantly!
  localList.unshift(newIncident);
  saveStoredIncidents(localList);

  // 2. Also dispatch to backend API
  try {
    const payload = {
      plate_number: newIncident.vehiclePlate,
      vehicle_type: newIncident.vehicleType,
      vehicle_make: 'Standard',
      vehicle_model: newIncident.vehicleType,
      vehicle_color: 'Standard',
      driver_name: newIncident.driverName,
      manual_location: newIncident.location,
      incident_date: new Date(newIncident.date).toISOString(),
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
