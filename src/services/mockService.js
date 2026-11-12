// Mock data for development — swap real service calls with these for offline work

export const mockIncidents = [
  { id: 1, plate: 'ABC-123', offence: 'Speeding', location: 'Main St', date: '2026-11-01', status: 'Open' },
  { id: 2, plate: 'XYZ-789', offence: 'No Seatbelt', location: 'Park Ave', date: '2026-11-03', status: 'Resolved' },
];

export const mockVehicles = [
  { id: 1, plate: 'ABC-123', type: 'Car', owner: 'John Doe', colour: 'Red', year: 2018 },
  { id: 2, plate: 'XYZ-789', type: 'Motorcycle', owner: 'Jane Smith', colour: 'Black', year: 2021 },
];

export const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@toms.gov', role: 'admin' },
  { id: 2, name: 'Field Officer', email: 'officer@toms.gov', role: 'officer' },
];

// Stub service functions
export const mockGetIncidents = () => Promise.resolve({ data: mockIncidents });
export const mockSearchVehicle = (plate) =>
  Promise.resolve({ data: mockVehicles.filter((v) => v.plate === plate) });
export const mockGetProfile = () => Promise.resolve({ data: mockUsers[0] });
export const mockGetAuditLogs = () =>
  Promise.resolve({ data: [{ id: 1, action: 'Login', user: 'Admin User', timestamp: '2026-11-12T10:00:00Z' }] });
