// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  FileSpreadsheet,
  Users2,
  UserCheck,
  Shield,
  KeyRound,
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
      to: '/admin/users',
      label: 'Password Approvals & Users',
      icon: Users2,
      roles: [ROLES.ADMIN],
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
    <div className="flex flex-col h-full bg-[#052e16] text-white border-r border-[#064e3b] select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#064e3b]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 shadow-sm">
            <Shield size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div>
              <span className="text-base font-black tracking-widest text-white">
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/70 font-medium tracking-tight">
              Traffic Offence Management
            </p>
          </div>
        </div>

        {/* Close button for mobile drawer */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 text-emerald-200/70 hover:text-white rounded-lg hover:bg-emerald-900/60 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
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
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-950/40 font-bold border border-emerald-600/50'
                  : 'text-emerald-100/80 hover:bg-[#064e3b] hover:text-white'
              }`
            }
          >
            <Icon size={18} className="shrink-0 text-emerald-300" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer Card */}
      <div className="p-3 border-t border-[#064e3b] bg-[#042411]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#064e3b]/70 border border-emerald-800/80">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'O'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {user?.full_name || 'Officer On Duty'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono text-emerald-200/80">
                {user?.badge_number ? `#${user.badge_number}` : 'ACTIVE'}
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
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
          className="fixed inset-0 z-40 bg-[#052e16]/80 backdrop-blur-xs md:hidden"
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
