// src/pages/UserProfile.jsx
import React, { useState } from 'react';
import { User, Shield, Phone, Mail, Award, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, Button, Input } from '../components/ui';
import { ROLE_LABELS } from '../constants/roles';
import { STATUS_BADGE_VARIANTS } from '../constants/status';
import { formatDate } from '../utils/formatters';
import { apiClient } from '../services/apiClient';

function UserProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiClient.patch('/profiles/me', {
        full_name: fullName,
        phone_number: phoneNumber,
      });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setEditing(false);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = (user?.role && ROLE_LABELS[user.role]) || user?.role || 'Traffic Agent';
  const statusVariant = STATUS_BADGE_VARIANTS[user?.status] || 'success';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner / Officer Identity Card */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'O'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {user?.full_name || 'Enforcement Officer'}
                </h1>
                <Badge variant={statusVariant} className="uppercase text-[10px]">
                  {user?.status || 'Active'}
                </Badge>
              </div>
              <p className="text-xs text-amber-400 font-semibold mt-1">
                {roleLabel} · Badge #{user?.badge_number || 'N/A'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Officer ID: <span className="font-mono text-slate-300">{user?.id || '—'}</span>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Duty Status
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Authorized On Terminal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <Card
        title="Officer Credentials & Information"
        subtitle="Immutable badge identification and editable officer contact channels"
        action={
          !editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFullName(user?.full_name || '');
                setPhoneNumber(user?.phone_number || '');
                setEditing(true);
              }}
            >
              Edit Details
            </Button>
          )
        }
      >
        {message && (
          <div
            className={`p-3.5 mb-6 rounded-xl text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4 max-w-lg">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+234 800 000 0000"
            />
            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" variant="primary" size="sm" loading={saving}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 mt-0.5">
                <Award size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Official Badge Number
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                  {user?.badge_number || 'UNASSIGNED'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="p-2 rounded-lg bg-slate-900/10 text-slate-800 mt-0.5">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Enforcement System Role
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {roleLabel}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 mt-0.5">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Official Email Address
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {user?.email || '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 mt-0.5">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Direct Phone Line
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {user?.phone_number || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default UserProfile;
