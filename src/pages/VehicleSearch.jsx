import React, { useState } from 'react';

function VehicleSearch() {
  const [plate, setPlate] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    // TODO: replace with vehicleService.searchVehicle(plate)
    await new Promise(r => setTimeout(r, 500));
    setResults([]);
    setSearching(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Vehicle Search</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="Enter plate number e.g. ABC-123"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" disabled={searching}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-5 rounded transition">
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>
      {results !== null && (
        <div className="bg-white rounded-lg shadow p-4">
          {results.length === 0
            ? <p className="text-gray-500">No records found for <strong>{plate}</strong>.</p>
            : results.map(r => (
              <div key={r.id} className="border rounded p-3 mb-2">
                <p className="font-medium">{r.plate}</p>
                <p className="text-sm text-gray-600">{r.type} &mdash; {r.owner}</p>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default VehicleSearch;
