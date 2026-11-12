import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function Header() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between bg-blue-700 text-white px-5 py-3 shadow-md">
      <h1 className="text-lg font-semibold tracking-wide">Traffic Offence Management System</h1>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm opacity-80">{user.name}</span>}
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 bg-blue-800 hover:bg-blue-900 text-sm font-medium py-1.5 px-3 rounded transition">
          <LogOut size={15} /> Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
