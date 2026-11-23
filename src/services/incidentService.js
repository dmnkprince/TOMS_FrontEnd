// src/services/incidentService.js
import { apiClient } from './apiClient';
import { enqueue, syncQueue } from './offlineQueue';

const STORAGE_KEY = 'toms_custom_incidents';

// Initial sample records with Time and Date automatically captured
const initialSampleIncidents = [
  {
    id: 'inc-seed-001',
    vehiclePlate: 'KJA-482-AA',
    bodyNumber: 'BD-101',
    vehicleType: 'Car',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    vehicleColor: 'Silver',
    time: '10:45:12',
    offenceType: 'Speeding',
    location: 'Lekki-Epe Expressway Km 14',
    date: '2026-11-12',
    description: 'Vehicle clocked exceeding 60km/h zone at 94km/h.',
    agent_id: 'c0000000-0000-0000-0000-000000000003',
    registered_by: 'officer.david@toms.gov',
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  {
    id: 'inc-seed-002',
    vehiclePlate: 'ABJ-118-RBC',
    bodyNumber: 'TR-408',
    vehicleType: 'Truck',
    vehicleMake: 'Mercedes',
    vehicleModel: 'Actros',
    vehicleColor: 'White',
    time: '14:20:00',
    offenceType: 'Running Red Light',
    location: 'Herbert Macaulay Junction, CBD',
    date: '2026-11-11',
    description: 'Vehicle failed to yield and crossed red traffic signal during high traffic.',
    agent_id: 'c0000000-0000-0000-0000-000000000004',
    registered_by: 'officer.aisha@toms.gov',
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    id: 'inc-seed-003',
    vehiclePlate: 'KND-771-AA',
    bodyNumber: 'BS-022',
    vehicleType: 'Bus',
    vehicleMake: 'Toyota',
    vehicleModel: 'HiAce',
    vehicleColor: 'Blue',
    time: '08:35:40',
    offenceType: 'Using Phone While Driving',
    location: 'Kano Ring Road Interchange',
    date: '2026-11-10',
    description: 'Driver observed actively operating handheld cellular device while in motion.',
    agent_id: 'c0000000-0000-0000-0000-000000000003',
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
    const seedMap = {
      'inc-seed-001': { vehicleMake: 'Toyota', vehicleModel: 'Camry', vehicleColor: 'Silver', bodyNumber: 'BD-101' },
      'inc-seed-002': { vehicleMake: 'Mercedes', vehicleModel: 'Actros', vehicleColor: 'White', bodyNumber: 'TR-408' },
      'inc-seed-003': { vehicleMake: 'Toyota', vehicleModel: 'HiAce', vehicleColor: 'Blue', bodyNumber: 'BS-022' },
    };

    return parsed.map((item) => {
      const seedDefaults = seedMap[item.id] || {};
      return {
        ...item,
        bodyNumber: item.bodyNumber || item.body_number || seedDefaults.bodyNumber || '—',
        vehicleMake: item.vehicleMake || item.vehicle_make || seedDefaults.vehicleMake || '—',
        vehicleModel: item.vehicleModel || item.vehicle_model || seedDefaults.vehicleModel || '—',
        vehicleColor: item.vehicleColor || item.vehicle_color || seedDefaults.vehicleColor || '—',
        time: item.time || (item.created_at ? new Date(item.created_at).toLocaleTimeString('en-GB') : '11:00:00'),
      };
    });
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

  const queryParams = { ...params };

  try {
    const response = await apiClient.get('/incidents', { params: queryParams });
    const data = response.data?.data || response.data || [];
    const serverIncidents = Array.isArray(data) ? data : data.incidents || [];

    const mappedServer = serverIncidents.map((s) => {
      const dt = s.incident_date ? new Date(s.incident_date) : new Date();
      const formattedTime = !isNaN(dt.getTime())
        ? dt.toLocaleTimeString('en-GB')
        : '12:00:00';
      const formattedDate = s.date || (s.incident_date ? s.incident_date.slice(0, 10) : '—');

      return {
        id: s.id || s.reference_number,
        vehiclePlate: s.plate_number || s.vehiclePlate || '—',
        bodyNumber: s.body_number || s.bodyNumber || '—',
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
        location: s.manual_location || s.location || '—',
        stateRegistered: s.state_registered || s.location_description || s.stateRegistered || '—',
        videoFileName: s.video_file_name || s.videoFileName || '—',
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

    return { data: merged };
  } catch (err) {
    console.warn('Backend unavailable, serving locally cached incidents', err);
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
    bodyNumber: (formData.bodyNumber || formData.body_number || '').trim().toUpperCase() || '—',
    vehicleType: formData.vehicleType || formData.vehicle_type || 'Car',
    vehicleMake: (formData.vehicleMake || formData.vehicle_make || '').trim() || '—',
    vehicleModel: (formData.vehicleModel || formData.vehicle_model || '').trim() || '—',
    vehicleColor: (formData.vehicleColor || formData.vehicle_color || '').trim() || '—',
    time: formData.time || systemTime,
    offenceType: formData.offenceType || formData.offence || 'General Violation',
    location: (formData.location || formData.manual_location || '').trim() || 'Unspecified Sector',
    stateRegistered: (formData.stateRegistered || '').trim() || '—',
    videoFileName: (formData.videoFileName || '').trim() || '—',
    date: formData.date || systemDate,
    description: (formData.description || formData.remarks || '').trim() || '—',
    agent_id: user?.id || null,
    registered_by: user?.email || user?.full_name || 'Enforcement Agent',
    created_at: now.toISOString(),
    _syncStatus: 'pending', // 'synced' | 'pending' | 'queued'
  };

  // 1. Immediately store locally for instant presentation
  localList.unshift(newIncident);
  saveStoredIncidents(localList);

  // 2. Build API payload
  let isoTimestamp;
  try {
    isoTimestamp = new Date(`${newIncident.date}T${newIncident.time}`).toISOString();
  } catch (e) {
    isoTimestamp = now.toISOString();
  }

  const payload = {
    plate_number: newIncident.vehiclePlate,
    body_number: newIncident.bodyNumber !== '—' ? newIncident.bodyNumber : null,
    vehicle_type: newIncident.vehicleType,
    vehicle_make: newIncident.vehicleMake !== '—' ? newIncident.vehicleMake : 'Standard',
    vehicle_model: newIncident.vehicleModel !== '—' ? newIncident.vehicleModel : 'Standard',
    vehicle_color: newIncident.vehicleColor !== '—' ? newIncident.vehicleColor : 'Standard',
    manual_location: newIncident.location,
    location_description: newIncident.stateRegistered !== '—' ? newIncident.stateRegistered : null,
    state_registered: newIncident.stateRegistered !== '—' ? newIncident.stateRegistered : null,
    video_file_name: newIncident.videoFileName !== '—' ? newIncident.videoFileName : null,
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

  // 3. Try to send to backend; enqueue if offline/failed
  try {
    await apiClient.post('/incidents', payload);
    // Mark as synced in local storage
    const updated = getStoredIncidents().map((i) =>
      i.id === newIncident.id ? { ...i, _syncStatus: 'synced' } : i
    );
    saveStoredIncidents(updated);
    newIncident._syncStatus = 'synced';
  } catch (err) {
    // Queue for later sync when back online
    await enqueue(payload, newIncident);
    const updated = getStoredIncidents().map((i) =>
      i.id === newIncident.id ? { ...i, _syncStatus: 'queued' } : i
    );
    saveStoredIncidents(updated);
    newIncident._syncStatus = 'queued';
    console.error(
      '[incidentService] Incident could not be saved to server, queued locally:',
      err.response?.status,
      err.response?.data?.message || err.message
    );
  }

  return { data: newIncident };
};

/**
 * Attempt to sync any queued offline incidents.
 * Call this on app startup or when the user comes back online.
 * Returns { synced, failed }
 */
export const syncOfflineIncidents = () => syncQueue(apiClient);

export const getIncident = (id) => apiClient.get(`/incidents/${id}`);

export const updateIncident = async (id, data) => {
  const localList = getStoredIncidents();

  // Format / normalize fields
  const updatedData = {
    ...data,
    id,
    vehiclePlate: (data.vehiclePlate || data.plate_number || '').trim().toUpperCase(),
    bodyNumber: data.bodyNumber || data.body_number || '—',
    vehicleType: data.vehicleType || data.vehicle_type || 'Car',
    vehicleMake: data.vehicleMake || data.vehicle_make || '—',
    vehicleModel: data.vehicleModel || data.vehicle_model || '—',
    vehicleColor: data.vehicleColor || data.vehicle_color || '—',
    offenceType: data.offenceType || data.offence || 'General Violation',
    location: data.location || data.manual_location || '—',
    stateRegistered: data.stateRegistered || data.location_description || '—',
    videoFileName: data.videoFileName || data.video_file_name || '—',
    description: data.description || data.remarks || '—',
    date: data.date,
    time: data.time,
    updated_at: new Date().toISOString(),
  };

  let matched = false;
  const updatedList = localList.map((item) => {
    if (item.id === id || item.reference_number === id) {
      matched = true;
      return { ...item, ...updatedData };
    }
    return item;
  });

  // If not already in local list, add it
  if (!matched) {
    updatedList.unshift(updatedData);
  }

  saveStoredIncidents(updatedList);

  // Send to backend API
  const payload = {
    plate_number: updatedData.vehiclePlate,
    body_number: updatedData.bodyNumber !== '—' ? updatedData.bodyNumber : null,
    vehicle_type: updatedData.vehicleType,
    vehicle_make: updatedData.vehicleMake !== '—' ? updatedData.vehicleMake : 'Standard',
    vehicle_model: updatedData.vehicleModel !== '—' ? updatedData.vehicleModel : 'Standard',
    vehicle_color: updatedData.vehicleColor !== '—' ? updatedData.vehicleColor : 'Standard',
    manual_location: updatedData.location,
    location_description: updatedData.stateRegistered !== '—' ? updatedData.stateRegistered : null,
    state_registered: updatedData.stateRegistered !== '—' ? updatedData.stateRegistered : null,
    time: updatedData.time,
    date: updatedData.date,
    remarks: updatedData.description,
    offenceType: updatedData.offenceType,
  };

  try {
    const res = await apiClient.put(`/incidents/${id}`, payload);
    return { data: res.data?.data || updatedData };
  } catch (err) {
    console.warn('Backend update failed or offline, changes preserved locally:', err);
    return { data: updatedData };
  }
};

export const deleteIncident = async (id) => {
  const localList = getStoredIncidents();
  const updatedList = localList.filter((item) => item.id !== id && item.reference_number !== id);
  saveStoredIncidents(updatedList);

  try {
    const res = await apiClient.delete(`/incidents/${id}`);
    return { data: res.data?.data || { id, deleted: true } };
  } catch (err) {
    console.warn('Backend delete failed or offline, deleted locally:', err);
    return { data: { id, deleted: true } };
  }
};
