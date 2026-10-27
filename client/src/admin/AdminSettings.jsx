import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { getImageUrl } from '../utils/formatters';
import { 
  Save, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Globe, 
  Shield, 
  Upload, 
  Download, 
  RefreshCw, 
  Image as ImageIcon, 
  Flame, 
  Database, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function AdminSettings() {
  const { settings, refreshSettings } = useSettings();
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Backup state
  const [backupStatus, setBackupStatus] = useState(null);
  const [restoring, setRestoring] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwStatus, setPwStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    setForm({ ...settings });
    loadBackupStatus();
  }, [settings]);

  const loadBackupStatus = async () => {
    try {
      const res = await api.getBackupStatus();
      if (res && res.success) {
        setBackupStatus(res.data);
      }
    } catch (e) {
      // Non-fatal
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Client-side image compression to Base64 (immune to filesystem wipes)
  const compressImage = (file, maxDim = 900, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      showToast('Optimizing and loading logo...');
      const base64 = await compressImage(file, 600, 0.9);
      setForm(prev => ({ ...prev, logo_url: base64 }));
      showToast('Logo image loaded! Click "Save All Settings" below to publish.');
    } catch (err) {
      alert('Error reading logo file');
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      showToast('Optimizing and loading hero image...');
      const base64 = await compressImage(file, 1200, 0.85);
      setForm(prev => ({ ...prev, hero_image: base64 }));
      showToast('Hero image loaded! Click "Save All Settings" below to publish.');
    } catch (err) {
      alert('Error reading hero image file');
    }
  };

  const handleHeroBgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      showToast('Optimizing and loading background...');
      const base64 = await compressImage(file, 1400, 0.8);
      setForm(prev => ({ ...prev, hero_bg_image: base64 }));
      showToast('Background image loaded! Click "Save All Settings" below to publish.');
    } catch (err) {
      alert('Error reading background file');
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateSettings(form);
      if (res && res.success) {
        showToast('Store settings saved successfully!');
        refreshSettings();
        loadBackupStatus();
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

  const handleExportBackup = async () => {
    try {
      showToast('Generating store backup file...');
      const res = await api.exportBackup();
      const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taj-e-konain-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Backup downloaded to your computer!');
    } catch (err) {
      alert('Failed to download backup');
    }
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm('Are you sure you want to restore the store from this backup file? Existing data will be replaced with the backup file data.')) {
      e.target.value = '';
      return;
    }

    setRestoring(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          const res = await api.importBackup(parsed);
          if (res && res.success) {
            showToast(res.message);
            refreshSettings();
            loadBackupStatus();
          } else {
            alert(res?.message || 'Failed to restore');
          }
        } catch (err) {
          alert('Invalid backup JSON file: ' + err.message);
        } finally {
          setRestoring(false);
          e.target.value = '';
        }
      };
      reader.readAsText(file);
    } catch (err) {
      alert('Failed to read file');
      setRestoring(false);
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
    <div className="space-y-8 max-w-4xl pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-orange-500/40 animate-slideUp">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Store &amp; Branding Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Edit your website logo, hero image, WhatsApp contact info, Karachi location, and technical SEO.
        </p>
      </div>

      <form onSubmit={handleSettingsSubmit} className="space-y-8">
        
        {/* 1. BRAND LOGO CUSTOMIZATION */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Website Logo &amp; Brand Emblem</span>
            </h2>
            <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Live in Navbar &amp; Footer
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-1">
            {/* Live Preview Box */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950 border-3 border-amber-500/70 p-1 flex items-center justify-center overflow-hidden shadow-xl">
                <img
                  src={getImageUrl(form.logo_url, '/images/taj-logo.png')}
                  alt="Store Logo Preview"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { e.target.src = '/images/taj-logo.png'; }}
                />
              </div>
              <span className="text-2xs text-slate-400 font-medium">Navbar Preview</span>
            </div>

            {/* Upload Controls */}
            <div className="flex-1 w-full space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700">Upload New Logo from Computer</label>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <label className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-4 h-4 text-orange-400" />
                    <span>Choose Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({ ...prev, logo_url: '/images/taj-logo.png' }));
                      showToast('Reset to official Taj-e-Konain gold circular badge');
                    }}
                    className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors"
                  >
                    <span>Use Official Gold Badge</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider">Logo URL / Base64</label>
                <input
                  type="text"
                  placeholder="/images/taj-logo.png or https://... or data:image/..."
                  value={form.logo_url || ''}
                  onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. HOMEPAGE HERO SECTION & BACKGROUND VISUALS */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span>Homepage Hero Showcase &amp; Background</span>
            </h2>
            <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              Storefront Header
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Hero Image Showcase */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Hero Main Showcase Image</label>
              
              <div className="aspect-16/10 rounded-2xl bg-slate-900 border-2 border-slate-800 p-2 flex items-center justify-center overflow-hidden shadow-inner">
                <img
                  src={getImageUrl(form.hero_image, '/images/hero-banner.svg')}
                  alt="Hero Preview"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { e.target.src = '/images/hero-banner.svg'; }}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-orange-400" />
                  <span>Upload Hero Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  placeholder="/images/hero-banner.svg or https://..."
                  value={form.hero_image || ''}
                  onChange={(e) => setForm({ ...form, hero_image: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {/* Hero Background Image */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Optional Hero Background Photo</label>
              
              <div className="aspect-16/10 rounded-2xl bg-slate-950 border border-slate-800 p-3 flex flex-col items-center justify-center text-center overflow-hidden">
                {form.hero_bg_image ? (
                  <img
                    src={getImageUrl(form.hero_bg_image)}
                    alt="Background Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="space-y-1 text-slate-400 p-4">
                    <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-xs">Using default modern charcoal glow</p>
                    <span className="text-2xs text-slate-500">Upload an image to show behind the hero section</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-orange-400" />
                  <span>Upload Background</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroBgUpload}
                    className="hidden"
                  />
                </label>
                {form.hero_bg_image && (
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, hero_bg_image: '' }))}
                    className="text-2xs font-bold text-red-600 hover:underline px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Hero Headlines & Text */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Hero Trust Badge Label</label>
              <input
                type="text"
                value={form.hero_badge_text || ''}
                onChange={(e) => setForm({ ...form, hero_badge_text: e.target.value })}
                placeholder="Pakistani Gas Burner Specialists • Sui Gas & LPG Ready"
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold"
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
              <label className="block text-xs font-bold text-slate-700">Hero Subtext Description</label>
              <textarea
                rows={2}
                value={form.hero_subtext || ''}
                onChange={(e) => setForm({ ...form, hero_subtext: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Top Announcement Banner</label>
              <input
                type="text"
                value={form.announcement_bar || ''}
                onChange={(e) => setForm({ ...form, announcement_bar: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. WHATSAPP & CONTACT DETAILS */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <Phone className="w-5 h-5 text-emerald-600" />
            <span>WhatsApp &amp; Karachi Physical Store Info</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Business Display Name</label>
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
                placeholder="923432833991"
                value={form.whatsapp_number || ''}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold font-mono text-emerald-700"
              />
              <span className="text-2xs text-slate-400">Used for all direct WhatsApp order links (923432833991).</span>
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
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">Karachi Physical Store Address</label>
              <input
                type="text"
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Google Maps Share Link</label>
              <input
                type="text"
                placeholder="https://share.google/31m1BrmEBxjzaiXpg"
                value={form.google_maps_url || ''}
                onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono"
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

        {/* 4. TECHNICAL SEO & METADATA */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>SEO, Meta Tags &amp; Domain</span>
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

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving Changes...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

      {/* 5. DATA PERSISTENCE & ONE-CLICK BACKUP / RESTORE */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <span>Store Data Backup &amp; Permanent Persistence</span>
          </h2>
          {backupStatus && (
            <span className="text-2xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {backupStatus.products} Products • {backupStatus.categories} Categories
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Keep your product catalog and customizations permanently protected. On Render free tier, instances sleep after 15 minutes of inactivity. Use <strong>Download Backup</strong> anytime to keep a full copy on your computer, or restore it with 1 click.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          {/* Download Backup */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Store Backup (JSON)</span>
          </button>

          {/* Restore Backup */}
          <label className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer transition-all hover:scale-102">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>{restoring ? 'Restoring Catalog...' : 'Restore from Backup File'}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              disabled={restoring}
              className="hidden"
            />
          </label>
        </div>

        {/* Permanent Cloud Database Info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mt-4 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Want 100% Zero-Touch Permanent Cloud Storage?</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            You can connect a 100% free cloud SQLite database (like <strong>Turso</strong> at <a href="https://turso.tech" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">turso.tech</a>). Turso never sleeps, stores your data forever, and offers 500 databases free.
          </p>
        </div>
      </div>

      {/* 6. SECURITY: CHANGE ADMIN PASSWORD */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
          <Shield className="w-5 h-5 text-slate-700" />
          <span>Change Administrator Password</span>
        </h2>

        {pwStatus.success && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Password successfully changed!</span>
          </div>
        )}

        {pwStatus.error && (
          <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">New Password (min 8 chars)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-hidden"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={pwStatus.loading}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
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
