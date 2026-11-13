// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Shield, Lock, AlertCircle } from 'lucide-react';
import { Input, Button } from '../components/ui';
import { requestPasswordChange } from '../services/passwordService';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await requestPasswordChange({
        email: email.trim(),
        newPassword: newPassword.trim(),
        reason: reason.trim() || 'Officer forgotten password recovery',
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err.message || 'Failed to submit password change request. Please contact your administrator.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-900 antialiased">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Shield size={20} />
          </div>
          <span className="text-sm font-black tracking-widest text-[#052e16]">
            
          </span>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center animate-in fade-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Request Awaiting Admin Approval
              </h2>
              <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-left text-xs text-emerald-900 space-y-2">
                <p className="font-semibold">
                  Security Policy: Only an Administrator can approve change of password.
                </p>
                <p className="text-emerald-800">
                  Your password change request for <strong className="font-mono text-emerald-950">{email}</strong> has been placed in the Admin Approval Queue.
                </p>
                <p className="text-emerald-800">
                  Once your System Administrator reviews and approves the request, your new password will become active.
                </p>
              </div>
            </div>
            <Link to="/login" className="block pt-2">
              <Button variant="primary" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Request Password Change
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered official email and desired new password. Note that{' '}
                <strong className="text-emerald-800 font-semibold">
                  only an Administrator can approve change of password
                </strong>.
              </p>
            </div>

            {/* Admin Policy Notice */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs">
              <p className="font-semibold flex items-center gap-1.5 text-emerald-800">
                <Lock size={14} /> Strict Administrative Control
              </p>
              <p className="mt-1 text-[11px] text-emerald-800 leading-relaxed">
                officers cannot change passwords unilaterally. All submissions require formal Administrator sign-off.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Official Email Address"
                type="email"
                id="reset-email"
                icon={Mail}
                placeholder="officer@toms.gov.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <Input
                label="Requested New Password"
                type="password"
                id="requested-password"
                icon={Lock}
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Reason for Request (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Routine credentials update or forgotten password"
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full text-sm font-bold shadow-md shadow-emerald-900/20"
              >
                Submit Request for Admin Approval
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
