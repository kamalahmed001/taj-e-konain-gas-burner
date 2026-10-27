import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Helmet } from 'react-helmet-async';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Star, 
  Settings, 
  FileText, 
  Mail, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Flame 
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, isAuthenticated, loading, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-500 animate-spin" />
          <span className="text-sm font-semibold">Verifying Administrator Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
    { name: 'Content & FAQs', path: '/admin/content', icon: FileText },
    { name: 'Inquiries', path: '/admin/inquiries', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <Helmet>
        <title>Admin Dashboard | Taj-e-Konain Gas Burner</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600/20 p-1 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <span className="font-bold text-sm tracking-wide">Taj-e-Konain Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col justify-between border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Brand */}
          <Link to="/" target="_blank" className="flex items-center gap-3 mb-8 group">
            <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-amber-500/60 p-0.5 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/images/taj-logo.png" alt="Taj-e-Konain" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="text-base font-black text-white block tracking-tight leading-none">TAJ-E-KONAIN</span>
              <span className="text-2xs font-bold text-orange-500 tracking-wider">ADMIN CONTROL</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`
                  }
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions in Sidebar */}
        <div className="p-6 border-t border-slate-800/80 space-y-3">
          <div className="text-xs text-slate-400">
            Logged in as: <strong className="text-white block">{admin?.username || 'Administrator'}</strong>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white py-1.5 transition-colors"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-950 text-slate-300 hover:text-red-300 py-2.5 rounded-xl text-xs font-bold transition-colors border border-slate-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex bg-white border-b border-slate-200/80 h-16 px-8 items-center justify-between">
          <div className="text-xs font-semibold text-slate-500">
            Taj-e-Konain Gas Burner Management Dashboard
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
