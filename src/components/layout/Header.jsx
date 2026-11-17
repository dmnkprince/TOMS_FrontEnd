// src/components/layout/Header.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../constants/roles';

function Header({ onMenuClick = () => {} }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = (user?.role && ROLE_LABELS[user.role]) || user?.role || 'Agent';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 sm:h-16 px-3.5 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>

        {/* Brand: Mobile compact icon & full desktop title */}
        <div className="flex items-center gap-2">
          <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-800 text-emerald-300">
            <Shield size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="sm:hidden flex items-center gap-1.5">
              <span className="text-sm font-black tracking-wider text-slate-900">TOMS</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                TERMINAL
              </span>
            </div>
            <h2 className="hidden sm:block text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              Traffic Offence Management System
            </h2>
          </div>
        </div>
      </div>

      {/* Right: Officer info & Logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Officer Badge Details */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user?.full_name || 'Officer'}
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold tracking-wide">
              {roleLabel} {user?.badge_number ? `· #${user.badge_number}` : ''}
            </p>
          </div>

          <Link
            to="/profile"
            title="View Profile"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#052e16] text-emerald-300 font-bold text-xs flex items-center justify-center border-2 border-emerald-600/40 shadow-xs hover:ring-2 hover:ring-emerald-400 transition"
          >
            {user?.full_name?.charAt(0)?.toUpperCase() || 'O'}
          </Link>

          <button
            onClick={handleLogout}
            title="Sign out of TOMS"
            className="flex items-center gap-1.5 py-1.5 px-2 sm:px-3 rounded-lg text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all duration-150 shadow-2xs active:scale-95"
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
