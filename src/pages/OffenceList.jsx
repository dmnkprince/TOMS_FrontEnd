import React from 'react';
import Badge from '../components/ui/Badge';

const MOCK_OFFENCES = [
  { id: 1, plate: 'ABC-123', offence: 'Speeding', location: 'Main St', date: '2026-11-01', status: 'Open' },
  { id: 2, plate: 'XYZ-789', offence: 'No Seatbelt', location: 'Park Ave', date: '2026-11-03', status: 'Resolved' },
  { id: 3, plate: 'LMN-456', offence: 'Drunk Driving', location: 'Highway 1', date: '2026-11-05', status: 'Pending Review' },
];

const statusVariant = { Open: 'warning', Resolved: 'success', 'Pending Review': 'error' };

function OffenceList() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Offence List</h2>
        <a href="/incidents/register"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition">
          + Register New
        </a>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Plate</th>
              <th className="px-4 py-3">Offence</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_OFFENCES.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{o.id}</td>
                <td className="px-4 py-3 font-medium">{o.plate}</td>
                <td className="px-4 py-3">{o.offence}</td>
                <td className="px-4 py-3">{o.location}</td>
                <td className="px-4 py-3">{o.date}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[o.status] || 'default'}>{o.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OffenceList;
