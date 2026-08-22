import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Globe, Lock, Mail, ArrowRight, KeyRound, CheckCircle2, X } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('traveler@globetrotter.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResetLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', {
        email: resetEmail,
        newPassword: newPassword || 'password123',
      });
      setResetSuccess(res.data.message);
      setEmail(resetEmail);
      if (newPassword) setPassword(newPassword);
    } catch (err: any) {
      setResetError(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#111E2E] p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-[#1E2D42]">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Sign in to manage your personalized travel itineraries</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-2xl">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetSuccess('');
                  setResetError('');
                  setShowForgotModal(true);
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-[#1E2D42] text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Create an Account
            </Link>
          </p>
          <div className="mt-4 p-3 bg-emerald-50/60 dark:bg-[#162235] rounded-xl text-[11px] text-slate-600 dark:text-slate-300 text-left space-y-1 border border-emerald-100 dark:border-[#1E2D42]">
            <p className="font-bold text-emerald-800 dark:text-emerald-300">Quick Demo Logins:</p>
            <p>• User: <code className="font-bold">traveler@globetrotter.com</code> / <code className="font-bold">password123</code></p>
            <p>• Admin: <code className="font-bold">admin@globetrotter.com</code> / <code className="font-bold">password123</code></p>
          </div>
        </div>
      </div>

      {/* Forgot Password Interactive Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111E2E] max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E2D42] space-y-5 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Reset Your Password</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enter your registered email to update credentials</p>
              </div>
            </div>

            {resetError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl">
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100"
                    placeholder="traveler@globetrotter.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  New Password (Optional)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100"
                    placeholder="Leave blank to reset to password123"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#162235] text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {resetLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
