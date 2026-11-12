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
