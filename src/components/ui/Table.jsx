// src/components/ui/Table.jsx
import React from 'react';
import Spinner from './Spinner';

function Table({
  columns = [],
  data = [],
  keyField = 'id',
  loading = false,
  emptyMessage = 'No records found matching your criteria.',
  onRowClick = null,
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key || col.label}
                  className={`px-4 py-3.5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${
                    col.className || ''
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Spinner size={28} className="text-amber-500" />
                    <span className="text-xs font-medium text-slate-500">
                      Loading data from server...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  <div className="max-w-xs mx-auto text-center">
                    <p className="text-sm font-medium text-slate-600">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const rowKey = row[keyField] || idx;
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key || col.label}
                        className={`px-4 py-3.5 whitespace-nowrap text-sm ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        } ${col.cellClassName || ''}`}
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
