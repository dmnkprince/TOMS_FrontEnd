// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from '../components/ui';

function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    const result = await login(email.trim(), password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 antialiased">
      {/* Left Branding Hero Panel - Dark Green Theme */}
      <div className="w-full md:w-5/12 lg:w-1/2 bg-[#052e16] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        {/* Background decorative grid/accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#064e3b]/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold mb-8">
            <Shield size={16} className="text-emerald-400" />
          
          </div>

       
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-200 tracking-tight mb-4">
            Traffic Offence Management System
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/80 max-w-md leading-relaxed">
            Secure, centralized platform for recording vehicle violations and tracking registered incidents. {/* and managing traffic enforcement operations.*/}
          </p>
        </div>

        {/* Feature Highlights 
        <div className="relative z-10 py-10 space-y-4 hidden sm:block">
          <div className="flex items-center gap-3 text-xs text-emerald-100/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Fast incident recording & real-time enforcement logs</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-emerald-100/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Multi-role access control for agents and supervisors</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-emerald-100/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Strict administrator authorization for password modifications</span>
          </div>
        </div> 
		*/}

        {/* Footer */}
        <div className="relative z-10 pt-4 border-t border-emerald-900 text-xs text-emerald-300/70 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} Aures</span>
        </div>
      </div>

      {/* Right Form Panel - Crisp White */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back, Enter your credentials to access your terminal.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-in fade-in">
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              id="login-email"
              icon={Mail}
              placeholder="officer@toms.gov.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  icon={Lock}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[32px] text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="flex items-center justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full text-sm font-bold shadow-md shadow-emerald-900/20"
            >
              Sign In to Terminal
            </Button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Authorized personnel only. </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
