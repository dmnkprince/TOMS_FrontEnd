import React from 'react';

function Table({ columns = [], data = [], keyField = 'id' }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">No records found.</td></tr>
            : data.map(row => (
              <tr key={row[keyField]} className="border-t hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default Table;
