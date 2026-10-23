import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import SEOHelmet from '../components/common/SEOHelmet';
import { 
  Flame, 
  ShieldCheck, 
  Award, 
  PhoneCall, 
  Truck, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { formatPhone } from '../utils/formatters';

export default function AboutPage() {
  const { settings } = useSettings();
  const [contentBlock, setContentBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await api.getContent('about');
        if (res && res.success && res.data && res.data.length > 0) {
          setContentBlock(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load about content:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAbout();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* SEO Helmet */}
      <SEOHelmet
        title="About Us"
        description="Learn about Taj-e-Konain Gas Burner — providing reliable gas stoves, commercial burners, and safety kitchen accessories across Pakistan."
        canonicalUrl="/about"
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 uppercase tracking-wider bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5" />
          <span>Local Pakistani Gas Appliance Specialists</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          About Taj-e-Konain Gas Burner
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Committed to delivering safe, fuel-efficient gas burners and kitchen appliances designed to withstand the demands of Pakistani cooking.
        </p>
      </div>

      {/* Main Content Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Visual Showcase */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 bg-slate-900 p-6 shadow-xl">
            <img
              src="/images/hero-banner.svg"
              alt="Taj-e-Konain Gas Burner Workshop"
              className="w-full h-auto object-cover rounded-2xl"
            />
            <div className="mt-4 p-4 rounded-xl bg-slate-800/80 text-white text-xs space-y-1">
              <span className="font-bold text-orange-400 block">Quality Assured Hardware</span>
              <p className="text-slate-300 text-2xs">
                Every stove model is inspected for leak-tight gas manifolds, high-spark ignition triggers, and flame balance before delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Story Text */}
        <div className="lg:col-span-7 space-y-6">
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line">
            {contentBlock ? contentBlock.content : `Taj-e-Konain Gas Burner is a dedicated Pakistani kitchen appliance and gas equipment store specializing in dependable gas stoves, commercial cooking burners, and high-quality gas safety accessories.

Founded with a commitment to providing Pakistani households and caterers with reliable, safe, and fuel-efficient cooking solutions, our catalog features durable stainless steel stoves, stylish tempered glass double and triple burners, and heavy-duty cast iron burners designed for traditional, robust Pakistani cooking.

We prioritize customer trust and convenience. That is why we provide personal, responsive customer assistance directly through WhatsApp, helping customers choose the right gas stove nozzles, safety regulators, and accessories for both Sui Gas (Natural Gas) and LPG cylinders.`}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-4">
            <a
              href={`https://wa.me/${settings.whatsapp_number || '923432833991'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Owner on WhatsApp ({formatPhone(settings.phone_number || '03432833991')})</span>
            </a>
          </div>
        </div>

      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Fuel Efficiency First</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            With rising cylinder costs and fluctuating natural gas pressure in Pakistan, our burners are engineered to produce maximum blue flame thermal output with minimal gas wastage.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Uncompromising Safety</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            From steel-braided explosion-proof gas pipes to auto shut-off regulators with pressure meters, we supply certified accessories to safeguard Pakistani families.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Nationwide Reach</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We securely package all orders in corrugated protective crates and ship via reliable couriers across all major cities and towns of Pakistan.
          </p>
        </div>
      </div>

    </div>
  );
}
