import React, { useState } from 'react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { getGeneralInquiryUrl } from '../services/whatsapp';
import { formatPhone } from '../utils/formatters';
import SEOHelmet from '../components/common/SEOHelmet';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Flame
} from 'lucide-react';

export default function ContactPage() {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setStatus({ loading: false, success: false, error: 'Please enter your name, phone number, and message.' });
      return;
    }

    try {
      const res = await api.sendContactMessage(formData);
      if (res && res.success) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ loading: false, success: false, error: res?.message || 'Failed to send message.' });
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus({ loading: false, success: false, error: 'Network error submitting inquiry.' });
    }
  };

  const handleWhatsAppQuickChat = () => {
    const url = getGeneralInquiryUrl({
      subject: 'Inquiry from Contact Page',
      phoneNumber: settings.whatsapp_number || '923432833991',
      storeName: settings.store_name || 'Taj-e-Konain Gas Burner'
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* SEO Helmet */}
      <SEOHelmet
        title="Contact Us & Store Location"
        description="Contact Taj-e-Konain Gas Burner on WhatsApp at 03432833991 or send us an inquiry. Pakistan nationwide delivery for gas stoves and kitchen appliances."
        canonicalUrl="/contact"
      />

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 uppercase tracking-wider bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full">
          <Phone className="w-3.5 h-3.5" />
          <span>We are here to assist you</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Contact Taj-e-Konain Gas Burner
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Need help choosing a gas stove, checking cylinder nozzle compatibility, or tracking an order? Reach out directly via WhatsApp or submit your message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Direct Contact Info & WhatsApp Action */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick WhatsApp Action Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950 border border-emerald-800 text-white space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
              <MessageSquare className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">
                Fastest Response: WhatsApp
              </h2>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Our sales team responds quickly on WhatsApp. Share photos of your kitchen counter or old stove for accurate recommendations.
              </p>
            </div>

            <button
              onClick={handleWhatsAppQuickChat}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all active:scale-98"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Message on WhatsApp ({formatPhone(settings.phone_number || '03432833991')})</span>
            </button>
          </div>

          {/* Store Details Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Store Information
            </h3>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Phone / WhatsApp</span>
                  <a href={`tel:${settings.phone_number || '03432833991'}`} className="font-bold text-slate-900 hover:text-orange-600">
                    {formatPhone(settings.phone_number || '03432833991')}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Email</span>
                  <a href={`mailto:${settings.email_address || 'contact@tajekonain.com'}`} className="font-bold text-slate-900 hover:text-orange-600">
                    {settings.email_address || 'contact@tajekonain.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 block font-semibold">Store Address</span>
                  <p className="font-bold text-slate-900 leading-snug">
                    {settings.address || 'House no.13/3 H area near, main Liaqat Market Rd, Model Colony H Area malir, Karachi, 75050'}
                  </p>
                  <p className="text-xs text-slate-500">
                    City: <span className="font-semibold text-slate-700">{settings.city || 'Karachi'}</span> • Postal: <span className="font-semibold text-slate-700">75050</span>
                  </p>
                  {settings.google_maps_url && (
                    <div className="pt-2">
                      <a
                        href={settings.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
                      >
                        <MapPin className="w-3.5 h-3.5 text-orange-400" />
                        <span>Open Location in Google Maps</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Business Hours</span>
                  <p className="font-bold text-slate-900 leading-snug">
                    {settings.business_hours || 'Mon - Sat: 9:00 AM - 9:00 PM | Sunday: Closed'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
          <div className="mb-6 space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              Send Us a Message
            </h2>
            <p className="text-xs text-slate-500">
              Leave your details and inquiry below. Our team will get back to you promptly.
            </p>
          </div>

          {status.success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been sent successfully. We will contact you soon.</span>
            </div>
          )}

          {status.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{status.error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 0343 2833991"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="e.g. Double Burner Inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Message *
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="How can we assist you with your gas stove or appliance needs?"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status.loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-orange-600 disabled:bg-slate-400 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md transition-all duration-200"
              >
                <Send className="w-4 h-4" />
                <span>{status.loading ? 'Sending Message...' : 'Submit Message'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
