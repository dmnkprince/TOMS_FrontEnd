// src/components/layout/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../constants/roles';

function Header({ onMenuClick = () => {} }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = (user?.role && ROLE_LABELS[user.role]) || user?.role || 'Enforcement Agent';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200/90 shadow-2xs">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            Traffic Offence Management System
          </h2>
        </div>
      </div>

      {/* Right: Officer info & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Officer Badge Details */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user?.full_name || 'Enforcement Officer'}
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold tracking-wide">
              {roleLabel} {user?.badge_number ? `· #${user.badge_number}` : ''}
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#052e16] text-emerald-300 font-bold text-xs flex items-center justify-center border-2 border-emerald-600/40 shadow-xs">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'O'}
          </div>

          <button
            onClick={handleLogout}
            title="Sign out of TOMS"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all duration-150 shadow-2xs"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
