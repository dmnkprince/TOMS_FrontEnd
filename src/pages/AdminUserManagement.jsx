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
import { getUsers, createUser, deleteUser, updateUser } from '../services/userService';

function AdminUserManagement() {
  const { user } = useAuth();
  const roleNormalized = user?.role ? String(user.role).toLowerCase() : '';
  const isAdmin = roleNormalized === 'admin';
  const isSupervisor = roleNormalized === 'supervisor';

  // ----- Password Request State -----
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [newStaff, setNewStaff] = useState({ full_name: '', badge_number: '', email: '', password: '', role: 'field_agent', phone_number: '' });
  const [feedback, setFeedback] = useState(null);

  // ----- User Management State -----
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userActionLoading, setUserActionLoading] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStaff, setEditStaff] = useState({ id: '', full_name: '', phone_number: '', role: 'field_agent' });

  const openEditModal = (userId) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      setEditStaff({
        id: targetUser.id,
        full_name: targetUser.full_name || '',
        phone_number: targetUser.phone_number || '',
        role: targetUser.role || 'field_agent',
      });
      setShowEditModal(true);
    }
  };
  const closeEditModal = () => setShowEditModal(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStaff((prev) => ({ ...prev, [name]: value }));
  };

  const submitEditStaff = async (e) => {
    e.preventDefault();
    setUserActionLoading(`edit-${editStaff.id}`);
    try {
      const payload = {
        full_name: editStaff.full_name,
        phone_number: editStaff.phone_number,
      };
      if (isAdmin && editStaff.role) {
        payload.role = editStaff.role;
      }
      await updateUser(editStaff.id, payload);
      setFeedback({ type: 'success', text: 'Staff updated successfully.' });
      await loadUsers();
      closeEditModal();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to edit staff.' });
    } finally {
      setUserActionLoading(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!isAdmin) {
      setFeedback({ type: 'error', text: 'Only an Administrator can change roles.' });
      return;
    }
    if (userId === user?.id && newRole !== 'admin') {
      setFeedback({ type: 'error', text: 'You cannot demote your own Administrator account.' });
      return;
    }
    setUserActionLoading(`role-${userId}`);
    try {
      await updateUser(userId, { role: newRole });
      setFeedback({ type: 'success', text: `Role updated successfully to ${newRole}.` });
      await loadUsers();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to update role.' });
    } finally {
      setUserActionLoading(null);
    }
  };

  // ----- Load Data -----
  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await getPasswordRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load password requests', err);
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const result = await getUsers();
      let profilesList = [];
      if (Array.isArray(result?.data)) {
        profilesList = result.data;
      } else if (Array.isArray(result?.data?.profiles)) {
        profilesList = result.data.profiles;
      } else if (Array.isArray(result?.profiles)) {
        profilesList = result.profiles;
      } else if (Array.isArray(result)) {
        profilesList = result;
      }
      setUsers(profilesList);
    } catch (err) {
      console.error('Failed to load users', err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadRequests();
    loadUsers();
  }, []);

  // ----- Password Request Handlers -----
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
    if (reason === null) return; // Cancelled
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

  // ----- User Management Handlers -----
  const openAddModal = () => {
    setNewStaff({
      full_name: '',
      badge_number: '',
      email: '',
      password: '',
      role: 'field_agent',
      phone_number: '',
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => setShowAddModal(false);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const submitNewStaff = async (e) => {
    e.preventDefault();
    setUserActionLoading('add');
    try {
      await createUser(newStaff);
      setFeedback({ type: 'success', text: 'Staff member added successfully.' });
      await loadUsers();
      closeAddModal();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to add staff.' });
    } finally {
      setUserActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!isAdmin && !isSupervisor) {
      setFeedback({ type: 'error', text: 'Only Admin/Supervisor can delete users.' });
      return;
    }
    if (userId === user.id) {
      setFeedback({ type: 'error', text: 'You cannot delete your own account.' });
      return;
    }
    if (!confirm('Are you sure you want to delete this user?')) return;
    setUserActionLoading(userId);
    try {
      await deleteUser(userId);
      setFeedback({ type: 'success', text: 'User deleted successfully.' });
      await loadUsers();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete user.' });
    } finally {
      setUserActionLoading(null);
    }
  };

  if (!isAdmin && !isSupervisor) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-2">
          Only Administrators or Supervisors may manage users and password requests.
        </p>
      </div>
    );
  }

  const safeRequests = Array.isArray(requests) ? requests : [];
  const pendingCount = safeRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = safeRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = safeRequests.filter((r) => r.status === 'rejected').length;

  const requestColumns = [
    {
      label: 'Officer / Badge',
      key: 'officer_name',
      render: (val, row) => (
        <div>
          <p className="font-bold text-xs text-slate-900">{val || 'Officer'}</p>
          <span className="font-mono text-[11px] text-emerald-800 font-semibold">
            {row?.badge_number ? `#${row.badge_number}` : 'No Badge'}
          </span>
        </div>
      ),
    },
    { label: 'Official Email', key: 'email', render: (val) => <span className="text-xs font-mono text-slate-700">{val || '—'}</span> },
    { label: 'Date Requested', key: 'requested_at', render: (val) => <span className="text-xs text-slate-500">{val ? new Date(val).toLocaleString() : '—'}</span> },
    { label: 'Reason / Context', key: 'reason', render: (val) => <span className="text-xs text-slate-600 line-clamp-1 max-w-xs" title={val}>{val || 'Credentials update'}</span> },
    {
      label: 'Approval Status',
      key: 'status',
      render: (val) => {
        if (val === 'pending') return <Badge variant="warning" className="font-bold text-[11px]">Pending Admin Approval</Badge>;
        if (val === 'approved') return <Badge variant="success" className="font-bold text-[11px]">Approved by Admin</Badge>;
        return <Badge variant="danger" className="font-bold text-[11px]">Rejected</Badge>;
      },
    },
    {
      label: 'Admin Authorization',
      key: 'id',
      align: 'right',
      render: (val, row) => {
        if (row?.status !== 'pending') {
          return (
            <span className="text-[11px] text-slate-400 font-medium">
              {row?.status === 'approved' ? `Authorized by ${row?.approved_by || 'Admin'}` : 'Declined'}
            </span>
          );
        }
        return (
          <div className="flex items-center justify-end gap-2">
            <Button variant="primary" size="sm" icon={Check} loading={actionLoading === val} onClick={() => handleApprove(val)} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold">Approve</Button>
            <Button variant="secondary" size="sm" icon={X} loading={actionLoading === val} onClick={() => handleReject(val)} className="text-rose-700 hover:bg-rose-50 border-rose-200">Reject</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Admin Console — Password Approvals</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Authorized administrator portal for reviewing and approving officer credential modifications.</p>
            </div>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <ShieldCheck size={16} />
          <span>Administrator Terminal Mode</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Approvals</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs"><Clock size={16} /></span>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{pendingCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Awaiting admin authorization</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Approved Changes</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs"><CheckCircle2 size={16} /></span>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{approvedCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Authorized by admin</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rejected Requests</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs"><X size={16} /></span>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{rejectedCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Declined requests</p>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${feedback.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-700 shrink-0" /> : <AlertCircle size={18} className="text-rose-700 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Password Requests Table */}
      <Card title="Password Change Approval Queue" subtitle="Review officer requests to approve or deny password modifications.">
        <Table columns={requestColumns} data={requests} loading={loadingRequests} emptyMessage="No pending or past password change requests recorded." />
      </Card>

      {/* User Management Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Staff Users</h2>
          {(isAdmin || isSupervisor) && (
            <Button variant="primary" onClick={openAddModal} size="sm" icon={User}>Add New Staff</Button>
          )}
        </div>
        {loadingUsers ? (
          <p>Loading users…</p>
        ) : (
          <Table
            data={users}
            columns={[
              { label: 'Full Name', key: 'full_name' },
              { label: 'Badge', key: 'badge_number' },
              { label: 'Email', key: 'email' },
              {
                label: 'Role',
                key: 'role',
                render: (val, row) => {
                  const roleName = val || 'field_agent';
                  if (!isAdmin || row?.id === user?.id) {
                    return (
                      <Badge
                        variant={roleName === 'admin' ? 'navy' : roleName === 'supervisor' ? 'warning' : 'info'}
                        className="font-bold text-xs"
                      >
                        {roleName === 'admin'
                          ? 'System Admin'
                          : roleName === 'supervisor'
                          ? 'Supervisor'
                          : roleName === 'field_agent'
                          ? 'Field Agent'
                          : 'Traffic Agent'}
                      </Badge>
                    );
                  }
                  return (
                    <select
                      value={roleName}
                      disabled={userActionLoading === `role-${row.id}`}
                      onChange={(e) => handleRoleChange(row.id, e.target.value)}
                      className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 shadow-2xs transition"
                    >
                      <option value="admin">Admin</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="agent">Agent</option>
                      <option value="field_agent">Field Agent</option>
                    </select>
                  );
                },
              },
              {
                label: 'Actions',
                key: 'id',
                align: 'right',
                render: (id) => (
                  <div className="flex gap-2 justify-end">
                    {(isAdmin || isSupervisor) && (
                      <Button variant="danger" size="xs" icon={X} loading={userActionLoading === id} onClick={() => handleDeleteUser(id)}>
                        Delete
                      </Button>
                    )}
                    {(isAdmin || isSupervisor) && (
                      <Button variant="secondary" size="xs" icon={User} loading={userActionLoading === `edit-${id}`} onClick={() => openEditModal(id)}>
                        Edit
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </section>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Add New Staff</h3>
            <form onSubmit={submitNewStaff} className="space-y-3">
              <Input name="full_name" placeholder="Full Name" required value={newStaff.full_name} onChange={handleAddChange} />
              <Input name="badge_number" placeholder="Badge Number" required value={newStaff.badge_number} onChange={handleAddChange} />
              <Input name="email" type="email" placeholder="Email" required value={newStaff.email} onChange={handleAddChange} />
              <Input name="password" type="password" placeholder="Password" required value={newStaff.password} onChange={handleAddChange} />
              <select name="role" value={newStaff.role} onChange={handleAddChange} className="w-full border rounded p-2">
                <option value="admin">Admin</option>
                <option value="supervisor">Supervisor</option>
                <option value="agent">Agent</option>
                <option value="field_agent">Field Agent</option>
              </select>
              <Input name="phone_number" placeholder="Phone (optional)" value={newStaff.phone_number} onChange={handleAddChange} />
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="secondary" onClick={closeAddModal}>Cancel</Button>
                <Button type="submit" variant="primary" loading={userActionLoading === 'add'}>Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Edit Staff</h3>
            <form onSubmit={submitEditStaff} className="space-y-3">
              <Input name="full_name" placeholder="Full Name" required value={editStaff.full_name} onChange={handleEditChange} />
              <Input name="phone_number" placeholder="Phone (optional)" value={editStaff.phone_number} onChange={handleEditChange} />
              {isAdmin && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    User Role
                  </label>
                  <select
                    name="role"
                    value={editStaff.role}
                    onChange={handleEditChange}
                    disabled={editStaff.id === user?.id}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600"
                  >
                    <option value="admin">System Administrator (Admin)</option>
                    <option value="supervisor">Enforcement Supervisor</option>
                    <option value="agent">Traffic Agent</option>
                    <option value="field_agent">Field Agent</option>
                  </select>
                  {editStaff.id === user?.id && (
                    <p className="text-[11px] text-amber-600 mt-1 font-medium">You cannot change your own Administrator role.</p>
                  )}
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="secondary" onClick={closeEditModal}>Cancel</Button>
                <Button type="submit" variant="primary" loading={userActionLoading === `edit-${editStaff.id}`} >Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUserManagement;
