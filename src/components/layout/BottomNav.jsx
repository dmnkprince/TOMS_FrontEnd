// src/components/layout/BottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  FileSpreadsheet,
  UserCheck,
  Users2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

function BottomNav() {
  const { user } = useAuth();
  const role = user?.role || ROLES.AGENT;
  const isAdmin = role === ROLES.ADMIN;

  const navItems = [
    {
      to: '/dashboard',
      label: 'Home',
      icon: LayoutDashboard,
    },
    {
      to: '/incidents',
      label: 'Report',
      icon: FileSpreadsheet,
    },
    {
      to: '/incidents/register',
      label: 'New incidents',
      icon: FilePlus2,
      isPrimary: true, // Prominent center action
    },
    ...(isAdmin
      ? [
          {
            to: '/admin/users',
            label: 'Admin',
            icon: Users2,
          },
        ]
      : []),
    {
      to: '/profile',
      label: 'Profile',
      icon: UserCheck,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-bottom"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(({ to, label, icon: Icon, isPrimary }) => {
          if (isPrimary) {
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center -mt-5 group focus:outline-none`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-150 active:scale-95 ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-emerald-900/40 ring-4 ring-emerald-100'
                          : 'bg-emerald-700 text-white shadow-emerald-800/30'
                      }`}
                    >
                      <Icon size={22} className="stroke-[2.2]" />
                    </div>
                    <span
                      className={`text-[10px] font-bold mt-1 tracking-tight ${
                        isActive ? 'text-emerald-800' : 'text-slate-600'
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors duration-150 min-w-[56px] focus:outline-none ${
                  isActive
                    ? 'text-emerald-800 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                  </div>
                  <span
                    className={`text-[10px] tracking-tight mt-0.5 ${
                      isActive ? 'font-bold text-emerald-800' : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
