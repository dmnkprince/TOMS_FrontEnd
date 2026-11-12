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
