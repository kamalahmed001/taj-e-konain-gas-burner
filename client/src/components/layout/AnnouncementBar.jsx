import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Flame, Phone, ShieldCheck } from 'lucide-react';
import { formatPhone } from '../../utils/formatters';

export default function AnnouncementBar() {
  const { settings } = useSettings();

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="inline-flex items-center justify-center p-1 bg-orange-500/20 text-orange-400 rounded-full animate-pulse">
            <Flame className="w-3.5 h-3.5" />
          </span>
          <span className="font-medium text-slate-100">
            {settings.announcement_bar || '🔥 Fast Nationwide Delivery across Pakistan • Direct WhatsApp Ordering: 03432833991'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300 text-xs">
          <div className="hidden md:flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Quality Gas Burners</span>
          </div>

          <a
            href={`https://wa.me/${settings.whatsapp_number || '923432833991'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-orange-400 transition-colors font-medium bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>Order Helpline: {formatPhone(settings.phone_number || '03432833991')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
