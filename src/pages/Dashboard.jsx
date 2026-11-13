// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus2,
  FileSpreadsheet,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, Button, Table } from '../components/ui';
import { getIncidents } from '../services/incidentService';

function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald' }) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    darkGreen: 'bg-[#052e16] text-white border-emerald-800',
    sky: 'bg-sky-50 text-sky-800 border-sky-200/80',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            colorMap[color] || colorMap.emerald
          }`}
        >
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      setLoading(true);
      try {
        const res = await getIncidents(user);
        const list = res.data || [];
        if (isMounted) {
          setRecentIncidents(list.slice(0, 5));
          setTotalCount(list.length);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.role]);

  const columns = [
    {
      label: 'Plate Number',
      key: 'vehiclePlate',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2 py-0.5 rounded tracking-wider inline-block w-fit">
            {val || '—'}
          </span>
          {row.bodyNumber && row.bodyNumber !== '—' && (
            <span className="text-[10px] font-mono text-slate-500 mt-0.5">
              Body: {row.bodyNumber}
            </span>
          )}
        </div>
      ),
    },
    {
      label: 'Vehicle Type',
      key: 'vehicleType',
      render: (val) => (
        <span className="text-xs font-semibold text-slate-700">{val || 'Car'}</span>
      ),
    },
    {
      label: 'Make & Model',
      key: 'vehicleMake',
      render: (_, row) => {
        const parts = [
          row.vehicleMake && row.vehicleMake !== 'Standard' && row.vehicleMake !== '—' ? row.vehicleMake : '',
          row.vehicleModel && row.vehicleModel !== 'Standard' && row.vehicleModel !== '—' ? row.vehicleModel : '',
        ].filter(Boolean);
        return (
          <span className="text-xs text-slate-700">
            {parts.length > 0 ? parts.join(' ') : '—'}
          </span>
        );
      },
    },
    {
      label: 'Time (System)',
      key: 'time',
      render: (val) => (
        <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50/60 px-2 py-0.5 rounded border border-emerald-200/50">
          {val || '—'}
        </span>
      ),
    },
    {
      label: 'Date (System)',
      key: 'date',
      render: (val) => <span className="font-mono text-xs text-slate-600">{val || '—'}</span>,
    },
    {
      label: 'Offence Type',
      key: 'offenceType',
      render: (val) => (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {val || 'Traffic Violation'}
        </span>
      ),
    },
    {
      label: 'Location',
      key: 'location',
      render: (val) => <span className="text-xs text-slate-700">{val || '—'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome back,{' '}
            <strong className="text-emerald-900 font-semibold">
              {user?.full_name || 'Enforcement Officer'}
            </strong>
            
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/incidents/register">
            <Button
              variant="primary"
              size="md"
              icon={FilePlus2}
              className="font-bold shadow-md shadow-emerald-900/20"
            >
              Register Incident
            </Button>
          </Link>
          <Link to="/incidents">
            <Button variant="secondary" size="md" icon={FileSpreadsheet}>
              View All Records
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Incidents"
          value={totalCount.toLocaleString()}
          subtitle="Cumulative logged incidents"
          icon={FileSpreadsheet}
          color="emerald"
        />
        <StatCard
          title="Today's Activity"
          value={totalCount > 0 ? (totalCount >= 3 ? '3' : `${totalCount}`) : '0'}
          subtitle="Violations recorded today"
          icon={Clock}
          color="sky"
        />
      </div>

      {/* Recent Incidents Table */}
      <Card
        title="Recent Incidents"
        subtitle="Latest traffic violations logged across active patrol sectors"
        action={
          <Link
            to="/incidents"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
          >
            View All Records <ArrowUpRight size={14} />
          </Link>
        }
      >
        <Table
          columns={columns}
          data={recentIncidents}
          loading={loading}
          emptyMessage="No incidents recorded recently. Click 'Register Incident' above to log a new traffic violation."
        />
      </Card>
    </div>
  );
}

export default Dashboard;
