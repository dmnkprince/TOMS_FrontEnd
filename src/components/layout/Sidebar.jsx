import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Search, List, User } from 'lucide-react';

const links = [
  { to: '/dashboard',          label: 'Dashboard',         icon: LayoutDashboard },
  { to: '/incidents/register', label: 'Register Incident',  icon: FilePlus },
  { to: '/vehicles/search',    label: 'Vehicle Search',     icon: Search },
  { to: '/offences',           label: 'Offence List',       icon: List },
  { to: '/profile',            label: 'Profile',            icon: User },
];

function Sidebar() {
  return (
    <aside className="w-60 bg-gray-50 border-r flex-shrink-0">
      <nav className="flex flex-col p-3 space-y-1 mt-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition " +
              (isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700")
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
