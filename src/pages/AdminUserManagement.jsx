// src/pages/AdminUserManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Check,
  X,
  Users2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Table, Badge, Button, Input } from '../components/ui';
import {
  getPasswordRequests,
  approvePasswordRequest,
  rejectPasswordRequest,
} from '../services/passwordService';
import { apiClient } from '../services/apiClient';

function AdminUserManagement() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getPasswordRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load password requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (reqId) => {
    if (!isAdmin) {
      setFeedback({
        type: 'error',
        text: 'Security Violation: Only an Administrator can approve change of password.',
      });
      return;
    }

    setActionLoading(reqId);
    setFeedback(null);
    try {
      const res = await approvePasswordRequest(reqId, user);
      setFeedback({ type: 'success', text: res.message });
      await loadRequests();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reqId) => {
    if (!isAdmin) {
      setFeedback({
        type: 'error',
        text: 'Security Violation: Only an Administrator can reject password changes.',
      });
      return;
    }

    const reason = prompt('Please enter a reason for rejecting this password change:');
    if (reason === null) return; // User cancelled prompt

    setActionLoading(reqId);
    setFeedback(null);
    try {
      const res = await rejectPasswordRequest(reqId, user, reason);
      setFeedback({ type: 'success', text: res.message });
      await loadRequests();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Access Restricted to System Administrators
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          In compliance with TOMS security guidelines, <strong>only an Administrator can approve change of password</strong> and administer user credentials. Your account does not hold administrative authority.
        </p>
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const requestColumns = [
    {
      label: 'Officer / Badge',
      key: 'officer_name',
      render: (val, row) => (
        <div>
          <p className="font-bold text-xs text-slate-900">{val || 'Officer'}</p>
          <span className="font-mono text-[11px] text-emerald-800 font-semibold">
            {row.badge_number ? `#${row.badge_number}` : 'No Badge'}
          </span>
        </div>
      ),
    },
    {
      label: 'Official Email',
      key: 'email',
      render: (val) => (
        <span className="text-xs font-mono text-slate-700">{val}</span>
      ),
    },
    {
      label: 'Date Requested',
      key: 'requested_at',
      render: (val) => (
        <span className="text-xs text-slate-500">
          {val ? new Date(val).toLocaleString() : '—'}
        </span>
      ),
    },
    {
      label: 'Reason / Context',
      key: 'reason',
      render: (val) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-xs" title={val}>
          {val || 'Credentials update'}
        </span>
      ),
    },
    {
      label: 'Approval Status',
      key: 'status',
      render: (val) => {
        if (val === 'pending') {
          return (
            <Badge variant="warning" className="font-bold text-[11px]">
              Pending Admin Approval
            </Badge>
          );
        }
        if (val === 'approved') {
          return (
            <Badge variant="success" className="font-bold text-[11px]">
              Approved by Admin
            </Badge>
          );
        }
        return (
          <Badge variant="danger" className="font-bold text-[11px]">
            Rejected
          </Badge>
        );
      },
    },
    {
      label: 'Admin Authorization',
      key: 'id',
      align: 'right',
      render: (val, row) => {
        if (row.status !== 'pending') {
          return (
            <span className="text-[11px] text-slate-400 font-medium">
              {row.status === 'approved'
                ? `Authorized by ${row.approved_by || 'Admin'}`
                : 'Declined'}
            </span>
          );
        }

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Check}
              loading={actionLoading === val}
              onClick={() => handleApprove(val)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Approve
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={X}
              loading={actionLoading === val}
              onClick={() => handleReject(val)}
              className="text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Admin Console — Password Approvals
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Authorized administrator portal for reviewing and approving officer credential modifications.
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <ShieldCheck size={16} />
          <span>Administrator Terminal Mode</span>
        </div>
      </div>

      {/* Security Notice Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
        <KeyRound size={20} className="text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950">
          <p className="font-bold">
            Administrative Mandate: Only Admin can approve change of password.
          </p>
          <p className="text-emerald-800 mt-0.5">
            When officers submit a password change or password reset request, the change is held in pending status until an Administrator reviews and explicitly authorizes it here.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Approvals
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
              <Clock size={16} />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{pendingCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Awaiting admin authorization</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Approved Changes
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <CheckCircle2 size={16} />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{approvedCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Authorized by admin</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Rejected Requests
            </span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
              <X size={16} />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{rejectedCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Declined requests</p>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-700 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Password Requests Table */}
      <Card
        title="Password Change Approval Queue"
        subtitle="Review officer requests to approve or deny password modifications."
      >
        <Table
          columns={requestColumns}
          data={requests}
          loading={loading}
          emptyMessage="No pending or past password change requests recorded."
        />
      </Card>
    </div>
  );
}

export default AdminUserManagement;
