// src/services/incidentService.js
import { apiClient } from './apiClient';

const STORAGE_KEY = 'toms_custom_incidents';

// Initial sample records with Time and Date automatically captured
const initialSampleIncidents = [
  {
    id: 'inc-seed-001',
    vehiclePlate: 'KJA-482-AA',
    vehicleType: 'Car',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    vehicleColor: 'Silver',
    time: '10:45:12',
    offenceType: 'Speeding',
    location: 'Lekki-Epe Expressway Km 14',
    date: '2026-11-12',
    description: 'Vehicle clocked exceeding 60km/h zone at 94km/h.',
    agent_id: 'c0000000-0000-0000-0000-000000000003', // Officer David Okafor
    registered_by: 'officer.david@toms.gov',
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  {
    id: 'inc-seed-002',
    vehiclePlate: 'ABJ-118-RBC',
    vehicleType: 'Truck',
    vehicleMake: 'Mercedes',
    vehicleModel: 'Actros',
    vehicleColor: 'White',
    time: '14:20:00',
    offenceType: 'Running Red Light',
    location: 'Herbert Macaulay Junction, CBD',
    date: '2026-11-11',
    description: 'Vehicle failed to yield and crossed red traffic signal during high traffic.',
    agent_id: 'c0000000-0000-0000-0000-000000000004', // Officer Aisha Bello
    registered_by: 'officer.aisha@toms.gov',
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    id: 'inc-seed-003',
    vehiclePlate: 'KND-771-AA',
    vehicleType: 'Bus',
    vehicleMake: 'Toyota',
    vehicleModel: 'HiAce',
    vehicleColor: 'Blue',
    time: '08:35:40',
    offenceType: 'Using Phone While Driving',
    location: 'Kano Ring Road Interchange',
    date: '2026-11-10',
    description: 'Driver observed actively operating handheld cellular device while in motion.',
    agent_id: 'c0000000-0000-0000-0000-000000000003', // Officer David Okafor
    registered_by: 'officer.david@toms.gov',
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

export const getIncidents = async (currentUser = null, params = {}) => {
  const localList = getStoredIncidents();

  let user = currentUser;
  if (!user) {
    try {
      const stored = localStorage.getItem('toms_user');
      if (stored) user = JSON.parse(stored);
    } catch (e) {}
  }

  const isAgent = user?.role === 'agent' || user?.role === 'officer';
  const queryParams = { ...params };
  if (isAgent && user?.id) {
    queryParams.agent_id = user.id;
  }

  try {
    const response = await apiClient.get('/incidents', { params: queryParams });
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
        vehicleMake: s.vehicle_make || s.vehicleMake || '—',
        vehicleModel: s.vehicle_model || s.vehicleModel || '—',
        vehicleColor: s.vehicle_color || s.vehicleColor || '—',
        time: s.time || formattedTime,
        offenceType:
          s.offences?.[0]?.title ||
          s.offences?.[0]?.category ||
          s.offenceType ||
          'Traffic Violation',
        location: s.manual_location || s.location || s.location_description || '—',
        date: formattedDate,
        description: s.remarks || s.description || '—',
        agent_id: s.agent_id,
        registered_by: s.registered_by || s.agent_name || s.agent_badge,
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

    // Role-based visibility:
    // Officers/agents can only view incidents they registered.
    // Admins and supervisors can view incidents recorded by everyone.
    if (isAgent && user) {
      const filteredForAgent = merged.filter((item) => {
        return (
          (item.agent_id && item.agent_id === user.id) ||
          (item.registered_by &&
            (item.registered_by === user.email ||
              item.registered_by === user.full_name ||
              item.registered_by === user.badge_number))
        );
      });
      return { data: filteredForAgent };
    }

    return { data: merged };
  } catch (err) {
    console.warn('Backend unavailable, serving locally cached incidents', err);

    // Apply role-based visibility to offline/local storage
    if (isAgent && user) {
      const filteredForAgent = localList.filter((item) => {
        return (
          (item.agent_id && item.agent_id === user.id) ||
          (item.registered_by &&
            (item.registered_by === user.email ||
              item.registered_by === user.full_name ||
              item.registered_by === user.badge_number))
        );
      });
      return { data: filteredForAgent };
    }

    return { data: localList };
  }
};

export const createIncident = async (formData, currentUser = null) => {
  const localList = getStoredIncidents();

  let user = currentUser;
  if (!user) {
    try {
      const stored = localStorage.getItem('toms_user');
      if (stored) user = JSON.parse(stored);
    } catch (e) {}
  }

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
    vehicleMake: (formData.vehicleMake || formData.vehicle_make || '').trim() || '—',
    vehicleModel: (formData.vehicleModel || formData.vehicle_model || '').trim() || '—',
    vehicleColor: (formData.vehicleColor || formData.vehicle_color || '').trim() || '—',
    time: formData.time || systemTime,
    offenceType: formData.offenceType || formData.offence || 'General Violation',
    location: (formData.location || formData.manual_location || '').trim() || 'Unspecified Sector',
    date: formData.date || systemDate,
    description: (formData.description || formData.remarks || '').trim() || '—',
    agent_id: user?.id || null,
    registered_by: user?.email || user?.full_name || 'Enforcement Agent',
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
      vehicle_make: newIncident.vehicleMake !== '—' ? newIncident.vehicleMake : 'Standard',
      vehicle_model: newIncident.vehicleModel !== '—' ? newIncident.vehicleModel : 'Standard',
      vehicle_color: newIncident.vehicleColor !== '—' ? newIncident.vehicleColor : 'Standard',
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
