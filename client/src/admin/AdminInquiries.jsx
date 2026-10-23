import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Mail, PhoneCall, Clock, User, MessageSquare } from 'lucide-react';
import { formatPhone } from '../utils/formatters';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getContactInquiries();
        if (res && res.success) {
          setInquiries(res.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Customer Inquiries
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Messages submitted by visitors through the storefront Contact form.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map(n => <div key={n} className="h-24 bg-slate-200 rounded-2xl" />)}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <Mail className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Inquiries Yet</h3>
          <p className="text-xs text-slate-500">Contact form messages will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
            const replyUrl = `https://wa.me/${cleanPhone.startsWith('92') ? cleanPhone : '92' + cleanPhone.replace(/^0/, '')}?text=Assalam-o-Alaikum%20${encodeURIComponent(inq.name)},%20this%20is%20Taj-e-Konain%20Gas%20Burner%20replying%20to%20your%20inquiry%20regarding%20${encodeURIComponent(inq.subject || 'our products')}`;

            return (
              <div key={inq.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" />
                    <span className="font-bold text-slate-900 text-sm">{inq.name}</span>
                    <span className="text-xs text-slate-400 font-mono">({inq.phone})</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{inq.created_at}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {inq.subject && (
                    <div className="text-xs font-bold text-slate-800">
                      Subject: {inq.subject}
                    </div>
                  )}
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                    {inq.message}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <a
                    href={replyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
