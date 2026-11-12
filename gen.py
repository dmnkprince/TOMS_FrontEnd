import os, sys

ROOT = r"d:\xamp\htdocs\3MTMedify\3mtt\TOMS_FrontEnd\src"

files = {}

# ─── App.jsx ──────────────────────────────────────────────────────────────────
files["App.jsx"] = """\
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IncidentRegister from './pages/IncidentRegister';
import VehicleSearch from './pages/VehicleSearch';
import OffenceList from './pages/OffenceList';
import UserProfile from './pages/UserProfile';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/incidents/register" element={<ProtectedRoute><DashboardLayout><IncidentRegister /></DashboardLayout></ProtectedRoute>} />
      <Route path="/vehicles/search" element={<ProtectedRoute><DashboardLayout><VehicleSearch /></DashboardLayout></ProtectedRoute>} />
      <Route path="/offences" element={<ProtectedRoute><DashboardLayout><OffenceList /></DashboardLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><DashboardLayout><UserProfile /></DashboardLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
"""

# ─── Login.jsx ────────────────────────────────────────────────────────────────
files["pages/Login.jsx"] = """\
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-700">TOMS</h1>
          <p className="text-gray-500 text-sm mt-1">Traffic Offence Management System</p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded px-3 py-2 mb-4 text-sm">{error}</div>
        )}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            id="username" type="text" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded transition">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default Login;
"""

# ─── Dashboard.jsx ────────────────────────────────────────────────────────────
files["pages/Dashboard.jsx"] = """\
import React from 'react';
import { useAuth } from '../context/AuthContext';

function StatCard({ title, value, color }) {
  return (
    <div className={"bg-white rounded-lg shadow p-5 border-l-4 " + color}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Welcome back, {user ? user.name : 'Officer'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Incidents" value="0" color="border-blue-500" />
        <StatCard title="Open Cases" value="0" color="border-yellow-500" />
        <StatCard title="Resolved" value="0" color="border-green-500" />
        <StatCard title="Pending Review" value="0" color="border-red-500" />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
        <p className="text-gray-400 text-sm">No recent activity yet. Register an incident to get started.</p>
      </div>
    </div>
  );
}

export default Dashboard;
"""

# ─── IncidentRegister.jsx ─────────────────────────────────────────────────────
files["pages/IncidentRegister.jsx"] = """\
import React, { useState } from 'react';

const OFFENCE_TYPES = ['Speeding', 'Running Red Light', 'No Seatbelt', 'Drunk Driving', 'Illegal Parking', 'Using Phone While Driving'];
const VEHICLE_TYPES = ['Car', 'Motorcycle', 'Truck', 'Bus', 'Van'];

function IncidentRegister() {
  const [form, setForm] = useState({
    vehiclePlate: '', vehicleType: '', driverName: '',
    offenceType: '', location: '', date: '', description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with incidentService.createIncident(form)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ vehiclePlate: '', vehicleType: '', driverName: '', offenceType: '', location: '', date: '', description: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Register Incident</h2>
      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded px-4 py-2 mb-4">
          Incident registered successfully.
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Plate *</label>
            <input name="vehiclePlate" value={form.vehiclePlate} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select name="vehicleType" value={form.vehicleType} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select...</option>
              {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
            <input name="driverName" value={form.driverName} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offence Type *</label>
            <select name="offenceType" value={form.offenceType} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select...</option>
              {OFFENCE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition">
          Submit Incident
        </button>
      </form>
    </div>
  );
}

export default IncidentRegister;
"""

# ─── VehicleSearch.jsx ────────────────────────────────────────────────────────
files["pages/VehicleSearch.jsx"] = """\
import React, { useState } from 'react';

function VehicleSearch() {
  const [plate, setPlate] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    // TODO: replace with vehicleService.searchVehicle(plate)
    await new Promise(r => setTimeout(r, 500));
    setResults([]);
    setSearching(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Vehicle Search</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="Enter plate number e.g. ABC-123"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" disabled={searching}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-5 rounded transition">
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>
      {results !== null && (
        <div className="bg-white rounded-lg shadow p-4">
          {results.length === 0
            ? <p className="text-gray-500">No records found for <strong>{plate}</strong>.</p>
            : results.map(r => (
              <div key={r.id} className="border rounded p-3 mb-2">
                <p className="font-medium">{r.plate}</p>
                <p className="text-sm text-gray-600">{r.type} &mdash; {r.owner}</p>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default VehicleSearch;
"""

# ─── OffenceList.jsx ──────────────────────────────────────────────────────────
files["pages/OffenceList.jsx"] = """\
import React from 'react';
import Badge from '../components/ui/Badge';

const MOCK_OFFENCES = [
  { id: 1, plate: 'ABC-123', offence: 'Speeding', location: 'Main St', date: '2026-11-01', status: 'Open' },
  { id: 2, plate: 'XYZ-789', offence: 'No Seatbelt', location: 'Park Ave', date: '2026-11-03', status: 'Resolved' },
  { id: 3, plate: 'LMN-456', offence: 'Drunk Driving', location: 'Highway 1', date: '2026-11-05', status: 'Pending Review' },
];

const statusVariant = { Open: 'warning', Resolved: 'success', 'Pending Review': 'error' };

function OffenceList() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Offence List</h2>
        <a href="/incidents/register"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition">
          + Register New
        </a>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Plate</th>
              <th className="px-4 py-3">Offence</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_OFFENCES.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{o.id}</td>
                <td className="px-4 py-3 font-medium">{o.plate}</td>
                <td className="px-4 py-3">{o.offence}</td>
                <td className="px-4 py-3">{o.location}</td>
                <td className="px-4 py-3">{o.date}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[o.status] || 'default'}>{o.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OffenceList;
"""

# ─── UserProfile.jsx ──────────────────────────────────────────────────────────
files["pages/UserProfile.jsx"] = """\
import React from 'react';
import { useAuth } from '../context/AuthContext';

function Field({ label, value }) {
  return (
    <div className="border-b pb-3 last:border-0">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="font-medium text-gray-800">{value || <span className="text-gray-400">Not set</span>}</p>
    </div>
  );
}

function UserProfile() {
  const { user } = useAuth();
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <div className="bg-white rounded-lg shadow p-6 max-w-md space-y-4">
        <Field label="Name" value={user?.name} />
        <Field label="Email" value={user?.email} />
        <Field label="Role" value={user?.role} />
        <Field label="Badge / ID" value={user?.badge} />
      </div>
    </div>
  );
}

export default UserProfile;
"""

# ─── components/layout files ──────────────────────────────────────────────────
files["components/layout/Header.jsx"] = """\
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
"""

files["components/layout/Sidebar.jsx"] = """\
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
"""

files["components/layout/DashboardLayout.jsx"] = """\
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
"""

# ─── UI components ────────────────────────────────────────────────────────────
files["components/ui/Button.jsx"] = """\
import React from 'react';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
};

function Button({ children, variant = 'primary', className = '', disabled, ...props }) {
  return (
    <button
      disabled={disabled}
      className={
        "font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 " +
        (variants[variant] || variants.primary) + " " + className
      }
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
"""

files["components/ui/Input.jsx"] = """\
import React from 'react';

function Input({ label, error, id, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <input
        id={id}
        className={
          "w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 " +
          (error ? "border-red-500" : "border-gray-300") + " " + className
        }
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default Input;
"""

files["components/ui/Select.jsx"] = """\
import React from 'react';

function Select({ label, error, id, options = [], className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <select
        id={id}
        className={
          "w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 " +
          (error ? "border-red-500" : "border-gray-300") + " " + className
        }
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default Select;
"""

files["components/ui/Card.jsx"] = """\
import React from 'react';

function Card({ title, children, footer, className = '' }) {
  return (
    <div className={"bg-white rounded-lg shadow p-5 " + className}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
      {footer && <div className="mt-4 pt-3 border-t text-sm text-gray-500">{footer}</div>}
    </div>
  );
}

export default Card;
"""

files["components/ui/Badge.jsx"] = """\
import React from 'react';

const colors = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error:   'bg-red-100   text-red-700',
  info:    'bg-blue-100  text-blue-700',
  default: 'bg-gray-100  text-gray-700',
};

function Badge({ children, variant = 'default' }) {
  return (
    <span className={"inline-block px-2 py-0.5 rounded-full text-xs font-medium " + (colors[variant] || colors.default)}>
      {children}
    </span>
  );
}

export default Badge;
"""

files["components/ui/Spinner.jsx"] = """\
import React from 'react';

function Spinner({ size = 24 }) {
  return (
    <svg className="animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24" width={size} height={size}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

export default Spinner;
"""

files["components/ui/Modal.jsx"] = """\
import React from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
"""

files["components/ui/Table.jsx"] = """\
import React from 'react';

function Table({ columns = [], data = [], keyField = 'id' }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">No records found.</td></tr>
            : data.map(row => (
              <tr key={row[keyField]} className="border-t hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default Table;
"""

files["components/ui/Toast.jsx"] = """\
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: React.createElement(CheckCircle, { className: 'text-green-500', size: 18 }),
  error:   React.createElement(XCircle,     { className: 'text-red-500',   size: 18 }),
  info:    React.createElement(Info,        { className: 'text-blue-500',  size: 18 }),
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id}
            className="flex items-center gap-2 bg-white border rounded-lg shadow-lg px-4 py-3 text-sm max-w-xs">
            {ICONS[t.type]}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
"""

files["components/ui/index.js"] = """\
export { default as Button }  from './Button';
export { default as Input }   from './Input';
export { default as Select }  from './Select';
export { default as Card }    from './Card';
export { default as Badge }   from './Badge';
export { default as Spinner } from './Spinner';
export { default as Modal }   from './Modal';
export { default as Table }   from './Table';
export { ToastProvider, useToast } from './Toast';
"""

# ─── Write all files ──────────────────────────────────────────────────────────
for rel, content in files.items():
    full = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written: {rel}")

print("All done.")
