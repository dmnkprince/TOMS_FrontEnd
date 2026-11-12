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
