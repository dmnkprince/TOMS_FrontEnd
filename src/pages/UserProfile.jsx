// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Shield,
  Phone,
  Mail,
  Award,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, Button, Input } from '../components/ui';
import { ROLE_LABELS } from '../constants/roles';
import { STATUS_BADGE_VARIANTS } from '../constants/status';
import { apiClient } from '../services/apiClient';
import {
  requestPasswordChange,
  getPasswordRequests,
} from '../services/passwordService';

function UserProfile() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordReason, setPasswordReason] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [userRequests, setUserRequests] = useState([]);

  const loadUserRequests = async () => {
    try {
      const all = await getPasswordRequests();
      const userReqs = all.filter(
        (r) => r.email?.toLowerCase() === user?.email?.toLowerCase()
      );
      setUserRequests(userReqs);
    } catch (e) {}
  };

  useEffect(() => {
    loadUserRequests();
  }, [user?.email]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg(null);
    try {
      await apiClient.patch('/profiles/me', {
        full_name: fullName,
        phone_number: phoneNumber,
      });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
      setEditing(false);
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordRequest = async (e) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 6) {
      setPasswordFeedback({
        type: 'error',
        text: 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        text: 'New password and confirmation do not match.',
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await requestPasswordChange({
        email: user?.email,
        officerName: user?.full_name,
        badgeNumber: user?.badge_number,
        newPassword,
        reason: passwordReason || 'Officer profile password renewal',
      });

      setPasswordFeedback({
        type: 'success',
        text: 'Password change request submitted. an Administrator will approve change of password.',
      });
      setNewPassword('');
      setConfirmPassword('');
      setPasswordReason('');
      await loadUserRequests();
    } catch (err) {
      setPasswordFeedback({
        type: 'error',
        text: err.message || 'Failed to submit password change request.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const roleLabel = (user?.role && ROLE_LABELS[user.role]) || user?.role || 'Traffic Agent';
  const statusVariant = STATUS_BADGE_VARIANTS[user?.status] || 'success';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner / Officer Identity Card - Dark Green Theme */}
      <div className="bg-[#052e16] text-white rounded-2xl p-6 sm:p-8 border border-[#064e3b] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/30 border-2 border-emerald-500/50 text-emerald-300 font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'O'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {user?.full_name || 'Enforcement Officer'}
                </h1>
                <Badge variant="darkGreen" className="uppercase text-[10px] bg-emerald-900 border-emerald-700">
                  {user?.status || 'Active'}
                </Badge>
              </div>
              <p className="text-xs text-emerald-300 font-semibold mt-1">
                {roleLabel} · Badge #{user?.badge_number || 'N/A'}
              </p>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">
                Officer ID: <span className="font-mono text-emerald-100">{user?.id || '—'}</span>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 border-emerald-900 pt-3 sm:pt-0">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300/70 font-semibold">
              Duty Status
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Authorized On Terminal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <Card
        title="Officer Credentials & Information"
        subtitle="Immutable badge identification and officer contact details"
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
              Edit Contact Details
            </Button>
          )
        }
      >
        {profileMsg && (
          <div
            className={`p-3.5 mb-6 rounded-xl text-xs font-semibold ${
              profileMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {profileMsg.text}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 mt-0.5">
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
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 mt-0.5">
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
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 mt-0.5">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Official Email Address
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                  {user?.email || '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 mt-0.5">
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

      {/* Password Management & Admin Approval Policy Card */}
      <Card
        title="Password & Security Authorization"
        subtitle="Request password change with mandatory Administrator review."
      >
        {/* Security Policy Alert */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs mb-6">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <Lock size={16} className="text-emerald-700" />
            <span>Only Admin Can Approve Change of Password</span>
          </div>
                  {isAdmin && (
            <div className="mt-3 pt-3 border-t border-emerald-200/80 flex items-center justify-between">
              <span className="font-semibold text-emerald-900">
                You are logged in as an Administrator.
              </span>
              <Link to="/admin/users">
                <Button variant="primary" size="sm" icon={ArrowRight}>
                  Open Admin Password Approvals
                </Button>
              </Link>
            </div>
          )}
        </div>

        {passwordFeedback && (
          <div
            className={`p-3.5 mb-5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              passwordFeedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            {passwordFeedback.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-700 shrink-0" />
            )}
            <span>{passwordFeedback.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordRequest} className="space-y-4 max-w-lg">
          <Input
            label="Requested New Password"
            type="password"
            placeholder="Min. 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Reason / Justification for Change
            </label>
            <input
              type="text"
              placeholder="e.g. Mandatory 90-day credentials refresh"
              value={passwordReason}
              onChange={(e) => setPasswordReason(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={passwordLoading}
            className="font-bold shadow-md shadow-emerald-900/20"
          >
            Submit for Admin Approval
          </Button>
        </form>

        {/* User's recent requests */}
        {userRequests.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Your Password Change Requests History
            </h3>
            <div className="space-y-2.5">
              {userRequests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Clock size={16} className="text-slate-400" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {r.reason || 'Password update'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Requested: {new Date(r.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    {r.status === 'pending' && (
                      <Badge variant="warning" className="text-[11px]">
                        Pending Admin Approval
                      </Badge>
                    )}
                    {r.status === 'approved' && (
                      <Badge variant="success" className="text-[11px]">
                        Approved by Admin
                      </Badge>
                    )}
                    {r.status === 'rejected' && (
                      <Badge variant="danger" className="text-[11px]">
                        Rejected
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default UserProfile;
