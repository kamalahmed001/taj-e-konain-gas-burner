import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Helmet } from 'react-helmet-async';
import { Lock, User, Key, Flame, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username.trim(), password);
      if (result.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(result.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('An error occurred while connecting to the admin service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <Helmet>
        <title>Admin Login | Taj-e-Konain Gas Burner</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Decorative flame glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-amber-500/60 p-1 mx-auto flex items-center justify-center shadow-2xl overflow-hidden">
          <img src="/images/taj-logo.png" alt="Taj-e-Konain" className="w-full h-full object-cover rounded-full" />
        </div>
        
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Taj-e-Konain Admin
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Storefront &amp; Inventory Management Portal
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6">
          
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">
                Administrator Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden transition-all"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden transition-all"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg transition-all active:scale-98"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-orange-400 transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>← Back to Customer Storefront</span>
            </a>
          </div>

        </div>

        <div className="mt-6 text-center text-2xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Protected with bcrypt password hashing &amp; JWT verification</span>
        </div>
      </div>
    </div>
  );
}
