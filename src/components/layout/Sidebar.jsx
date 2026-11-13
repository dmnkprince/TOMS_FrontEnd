// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  FileSpreadsheet,
  Search,
  Filter,
  FileCheck2,
  BarChart3,
  Users2,
  ShieldAlert,
  UserCheck,
  Shield,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_LABELS } from '../../constants/roles';

function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const { user } = useAuth();
  const role = user?.role || ROLES.AGENT;

  // Role-filtered navigation links matching specification
  const links = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: [ROLES.AGENT, ROLES.SUPERVISOR, ROLES.ADMIN],
    },
    {
      to: '/incidents/register',
      label: 'Register Incident',
      icon: FilePlus2,
      roles: [ROLES.AGENT, ROLES.SUPERVISOR, ROLES.ADMIN],
    },
    {
      to: '/incidents',
      label: 'Incident Records',
      icon: FileSpreadsheet,
      roles: [ROLES.AGENT, ROLES.SUPERVISOR, ROLES.ADMIN],
    },
    {
      to: '/vehicles/search',
      label: 'Vehicle Search',
      icon: Search,
      roles: [ROLES.AGENT, ROLES.SUPERVISOR, ROLES.ADMIN],
    },
    {
      to: '/incidents/search',
      label: 'Advanced Search',
      icon: Filter,
      roles: [ROLES.AGENT, ROLES.SUPERVISOR, ROLES.ADMIN],
    },
    {
      to: '/corrections',
      label: 'Corrections',
      icon: FileCheck2,
      roles: [ROLES.AGENT, ROLES.SUPERVISOR, ROLES.ADMIN],
    },
    {
      to: '/reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      roles: [ROLES.SUPERVISOR, ROLES.ADMIN],
    },
    {
      to: '/admin/users',
      label: 'User Management',
      icon: Users2,
      roles: [ROLES.ADMIN],
    },
    {
      to: '/audit-logs',
      label: 'Audit Logs',
      icon: ShieldAlert,
      roles: [ROLES.SUPERVISOR, ROLES.ADMIN],
    },
    {
      to: '/profile',
      label: 'Officer Profile',
      icon: UserCheck,
      roles: [ROLES.AGENT, ROLES.SUPERVISOR, ROLES.ADMIN],
    },
  ];

  const visibleLinks = links.filter((link) => link.roles.includes(role));

  const content = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-r border-slate-900 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow-sm">
            <Shield size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-widest text-amber-500">
                TOMS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">
              Traffic Offence Management
            </p>
          </div>
        </div>

        {/* Close button for mobile drawer */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {visibleLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-900/90 hover:text-white'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer Card */}
      <div className="p-3 border-t border-slate-900/80 bg-slate-950/80">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'O'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {user?.full_name || 'Officer On Duty'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono text-slate-300">
                {user?.badge_number ? `#${user.badge_number}` : 'ACTIVE'}
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {user?.role || 'Agent'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden md:flex w-64 flex-col shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
}

export default Sidebar;
