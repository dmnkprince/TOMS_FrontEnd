// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import IncidentRegister from './pages/IncidentRegister';
import VehicleSearch from './pages/VehicleSearch';
import OffenceList from './pages/OffenceList';
import UserProfile from './pages/UserProfile';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Authenticating Terminal...
          </span>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Authenticated Application Terminal */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents/register"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <IncidentRegister />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OffenceList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/search"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <VehicleSearch />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/offences"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OffenceList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UserProfile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
