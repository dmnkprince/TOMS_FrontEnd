// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus2,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, Button, Table } from '../components/ui';
import { apiClient } from '../services/apiClient';
import { formatCurrency, formatDate } from '../utils/formatters';
import { STATUS_BADGE_VARIANTS } from '../constants/status';

function StatCard({ title, value, subtitle, icon: Icon, color = 'amber' }) {
  const colorMap = {
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    sky: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            colorMap[color] || colorMap.amber
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
  const [stats, setStats] = useState({
    totalIncidents: 0,
    todayIncidents: 0,
    pendingCorrections: 0,
    activeOffences: 0,
  });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Fetch incidents list from backend
        const incRes = await apiClient.get('/incidents?limit=5');
        const incData = incRes.data?.data || incRes.data;
        const incidents = incData?.incidents || [];

        // Fetch reports summary
        let summaryData = null;
        try {
          const repRes = await apiClient.get('/reports/summary');
          summaryData = repRes.data?.data || repRes.data;
        } catch (e) {
          // Fallback if reports/summary is not yet seeded
        }

        // Fetch offence types count
        let offencesCount = 0;
        try {
          const offRes = await apiClient.get('/offence-types');
          const offData = offRes.data?.data || offRes.data;
          offencesCount = (offData?.offenceTypes || offData || []).length;
        } catch (e) {}

        if (isMounted) {
          setRecentIncidents(incidents);
          setStats({
            totalIncidents: summaryData?.total_incidents ?? incidents.length,
            todayIncidents: summaryData?.today_incidents ?? 0,
            pendingCorrections: summaryData?.pending_corrections ?? 0,
            activeOffences: offencesCount || 12,
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        // Fallback for initial demo state
        if (isMounted) {
          setRecentIncidents([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const columns = [
    {
      label: 'Reference No.',
      key: 'reference_number',
      render: (val) => (
        <span className="font-mono font-bold text-slate-900 tracking-tight text-xs bg-slate-100 px-2 py-1 rounded">
          {val || '—'}
        </span>
      ),
    },
    {
      label: 'Plate No.',
      key: 'plate_number',
      render: (val) => (
        <span className="font-bold text-slate-800 tracking-wide text-xs">
          {val || '—'}
        </span>
      ),
    },
    {
      label: 'Vehicle Model',
      key: 'vehicle_model',
      render: (val, row) => (
        <span className="text-slate-600 text-xs">
          {row.vehicle_make ? `${row.vehicle_make} ` : ''}
          {val || row.vehicle_type || '—'}
        </span>
      ),
    },
    {
      label: 'Recording Agent',
      key: 'agent_name',
      render: (val, row) => (
        <span className="text-xs font-medium text-slate-700">
          {val || 'Officer'} {row.agent_badge ? `(#${row.agent_badge})` : ''}
        </span>
      ),
    },
    {
      label: 'Incident Date',
      key: 'incident_date',
      render: (val) => (
        <span className="text-slate-500 text-xs">{formatDate(val)}</span>
      ),
    },
    {
      label: 'Status',
      key: 'status',
      render: (val) => {
        const variant = STATUS_BADGE_VARIANTS[val] || 'success';
        return <Badge variant={variant}>{val || 'recorded'}</Badge>;
      },
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
            <strong className="text-slate-800 font-semibold">
              {user?.full_name || 'Enforcement Officer'}
            </strong>
            . Terminal active on live traffic registry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/incidents/register">
            <Button
              variant="primary"
              size="md"
              icon={FilePlus2}
              className="font-bold shadow-md shadow-amber-500/20"
            >
              Register Incident
            </Button>
          </Link>
          <Link to="/vehicles/search">
            <Button variant="secondary" size="md" icon={Search}>
              Vehicle Lookup
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Incidents"
          value={stats.totalIncidents.toLocaleString()}
          subtitle="Cumulative registry"
          icon={FileSpreadsheet}
          color="amber"
        />
        <StatCard
          title="Today's Incidents"
          value={stats.todayIncidents.toLocaleString()}
          subtitle="Logged in past 24 hrs"
          icon={Clock}
          color="sky"
        />
        <StatCard
          title="Pending Corrections"
          value={stats.pendingCorrections.toLocaleString()}
          subtitle="Awaiting supervisor review"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Active Offence Types"
          value={stats.activeOffences.toLocaleString()}
          subtitle="Configured violation codes"
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Recent Incidents Table */}
      <Card
        title="Recent Incidents"
        subtitle="Latest traffic violations logged across all active patrol sectors"
        action={
          <Link
            to="/incidents"
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
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
