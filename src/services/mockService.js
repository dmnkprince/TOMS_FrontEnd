// Mock data for development — swap real service calls with these for offline work

export const mockIncidents = [
  { id: 1, plate: 'ABC-123', offence: 'Speeding', location: 'Main St', date: '2026-11-01', time: '09:15:30', status: 'Open' },
  { id: 2, plate: 'XYZ-789', offence: 'No Seatbelt', location: 'Park Ave', date: '2026-11-03', time: '14:40:00', status: 'Resolved' },
];

export const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@toms.gov', role: 'admin' },
  { id: 2, name: 'Field Officer', email: 'officer@toms.gov', role: 'officer' },
];

// Stub service functions
export const mockGetIncidents = () => Promise.resolve({ data: mockIncidents });
export const mockGetProfile = () => Promise.resolve({ data: mockUsers[0] });