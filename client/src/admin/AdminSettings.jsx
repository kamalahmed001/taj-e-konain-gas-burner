import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { Save, Key, CheckCircle, AlertCircle, Phone, Globe, Shield } from 'lucide-react';

export default function AdminSettings() {
  const { settings, refreshSettings } = useSettings();
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwStatus, setPwStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateSettings(form);
      if (res && res.success) {
        showToast('Store settings saved successfully!');
        refreshSettings();
      } else {
        alert(res?.message || 'Failed to update settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating store settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwStatus({ loading: true, success: false, error: null });

    if (newPassword !== confirmPassword) {
      setPwStatus({ loading: false, success: false, error: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 8) {
      setPwStatus({ loading: false, success: false, error: 'Password must be at least 8 characters' });
      return;
    }

    try {
      const res = await api.changePassword(currentPassword, newPassword);
      if (res && res.success) {
        setPwStatus({ loading: false, success: true, error: null });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Administrator password updated!');
      } else {
        setPwStatus({ loading: false, success: false, error: res?.message || 'Failed to change password' });
      }
    } catch (err) {
      setPwStatus({ loading: false, success: false, error: 'Error changing password' });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-slideUp">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Store &amp; SEO Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure WhatsApp numbers, contact info, business hours, and search engine defaults.
        </p>
      </div>

      <form onSubmit={handleSettingsSubmit} className="space-y-6">
        
        {/* Business & WhatsApp Integration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp &amp; Contact Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Business Name</label>
              <input
                type="text"
                value={form.store_name || ''}
                onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Primary WhatsApp Number *
              </label>
              <input
                type="text"
                placeholder="03432833991 or 923432833991"
                value={form.whatsapp_number || ''}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold font-mono text-emerald-700"
              />
              <span className="text-2xs text-slate-400">Used for all product &amp; cart WhatsApp order links.</span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Store Phone (Display)</label>
              <input
                type="text"
                value={form.phone_number || ''}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                value={form.email_address || ''}
                onChange={(e) => setForm({ ...form, email_address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Store Address</label>
              <input
                type="text"
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Google Maps Location Link</label>
              <input
                type="text"
                placeholder="https://share.google/... or https://maps.google.com/..."
                value={form.google_maps_url || ''}
                onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">City &amp; Area</label>
              <input
                type="text"
                value={form.city || ''}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Business Hours</label>
              <input
                type="text"
                value={form.business_hours || ''}
                onChange={(e) => setForm({ ...form, business_hours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Homepage Content & Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b pb-3">
            Homepage Announcement &amp; Headlines
          </h2>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Top Announcement Bar</label>
              <input
                type="text"
                value={form.announcement_bar || ''}
                onChange={(e) => setForm({ ...form, announcement_bar: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Hero Main Headline</label>
              <input
                type="text"
                value={form.hero_headline || ''}
                onChange={(e) => setForm({ ...form, hero_headline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Hero Subtext</label>
              <textarea
                rows={2}
                value={form.hero_subtext || ''}
                onChange={(e) => setForm({ ...form, hero_subtext: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* Technical SEO & Domain */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>SEO &amp; Canonical Domain</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">Production Website Domain</label>
              <input
                type="text"
                placeholder="https://tajekonain.com"
                value={form.production_domain || ''}
                onChange={(e) => setForm({ ...form, production_domain: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono"
              />
              <span className="text-2xs text-slate-400">Used for sitemap.xml URLs and OpenGraph metadata canonicalization.</span>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">Default Meta Title</label>
              <input
                type="text"
                value={form.meta_title_default || ''}
                onChange={(e) => setForm({ ...form, meta_title_default: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">Default Meta Description</label>
              <textarea
                rows={2}
                value={form.meta_description_default || ''}
                onChange={(e) => setForm({ ...form, meta_description_default: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

      {/* Security: Change Admin Password */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
          <Shield className="w-4 h-4 text-slate-700" />
          <span>Change Administrator Password</span>
        </h2>

        {pwStatus.success && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Password successfully changed!</span>
          </div>
        )}

        {pwStatus.error && (
          <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{pwStatus.error}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-md">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">New Password (min 8 chars)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={pwStatus.loading}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{pwStatus.loading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
