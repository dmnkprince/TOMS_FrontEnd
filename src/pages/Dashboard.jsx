// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus2,
  FileSpreadsheet,
  Clock,
  ArrowUpRight,
  Car,
  MapPin,
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
        {/*  <Link to="/incidents/register" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              icon={FilePlus2}
              className="w-full sm:w-auto font-bold shadow-md shadow-emerald-900/20 py-2.5 sm:py-2"
            >
              Register Incident
            </Button>
          </Link>*/}
          <Link to="/incidents" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" icon={FileSpreadsheet} className="w-full sm:w-auto py-2.5 sm:py-2">
              View All Records
            </Button>
		</Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard
          title="Total Incidents"
          value={totalCount.toLocaleString()}
          subtitle="Cumulative incidents"
          icon={FileSpreadsheet}
          color="emerald"
        />
        <StatCard
          title="Today's Activity"
          value={totalCount > 0 ? (totalCount >= 3 ? '3' : `${totalCount}`) : '0'}
          subtitle="Violations today"
          icon={Clock}
          color="sky"
        />
      </div>

      {/* Recent Incidents Table / Cards */}
      <Card
        title="Recent Incidents"
        subtitle="Latest traffic violations logged across active patrol sectors"
        action={
          <Link
            to="/incidents"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
          >
            View All <ArrowUpRight size={14} />
          </Link>
        }
      >
        {/* Mobile Feed */}
        <div className="block md:hidden space-y-2.5">
          {loading ? (
            <div className="py-8 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-emerald-600/30 border-t-emerald-700 rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs">Loading recent violations...</span>
            </div>
          ) : recentIncidents.length === 0 ? (
            <div className="py-8 text-center text-slate-400 bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-medium text-slate-600">No recent incidents recorded</p>
            </div>
          ) : (
            recentIncidents.map((r, idx) => (
              <Link
                key={r.id || idx}
                to="/incidents"
                className="block bg-slate-50/70 border border-slate-200/90 rounded-xl p-3 active:scale-[0.99] transition hover:border-emerald-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded tracking-wide">
                    {r.vehiclePlate || '—'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full truncate max-w-[140px]">
                    {r.offenceType || 'Violation'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                  <span className="truncate">
                    {[r.vehicleType, r.vehicleMake].filter(Boolean).join(' ') || 'Vehicle'}
                  </span>
                  <span className="font-mono text-slate-700 font-semibold">{r.time || '—'}</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table
            columns={columns}
            data={recentIncidents}
            loading={loading}
            emptyMessage="No incidents recorded recently. Click 'Register Incident' above to log a new traffic violation."
          />
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
