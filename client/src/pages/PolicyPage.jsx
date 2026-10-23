import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import SEOHelmet from '../components/common/SEOHelmet';
import { ShieldCheck, FileText, Truck, RotateCcw } from 'lucide-react';

const policyConfig = {
  shipping: {
    page: 'shipping',
    title: 'Shipping & Delivery Policy',
    desc: 'Nationwide delivery guidelines, packaging details, and transit expectations across Pakistan.',
    icon: Truck,
    canonical: '/shipping-policy'
  },
  returns: {
    page: 'returns',
    title: 'Returns & Refund Policy',
    desc: 'Clear policies on replacements, damaged transit claims, and customer satisfaction.',
    icon: RotateCcw,
    canonical: '/returns-policy'
  },
  privacy: {
    page: 'privacy',
    title: 'Privacy Policy',
    desc: 'How Taj-e-Konain protects customer phone numbers, addresses, and inquiry details.',
    icon: ShieldCheck,
    canonical: '/privacy-policy'
  },
  terms: {
    page: 'terms',
    title: 'Terms & Conditions',
    desc: 'Conditions of storefront use, WhatsApp ordering procedure, and catalog pricing notice.',
    icon: FileText,
    canonical: '/terms'
  }
};

export default function PolicyPage({ type = 'shipping' }) {
  const config = policyConfig[type] || policyConfig.shipping;
  const [contentBlock, setContentBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolicy() {
      setLoading(true);
      try {
        const res = await api.getContent(config.page);
        if (res && res.success && res.data && res.data.length > 0) {
          setContentBlock(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load policy content:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPolicy();
  }, [config.page]);

  const IconComponent = config.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      
      {/* SEO Helmet */}
      <SEOHelmet
        title={config.title}
        description={config.desc}
        canonicalUrl={config.canonical}
      />

      <div className="border-b border-slate-200 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          <IconComponent className="w-3.5 h-3.5" />
          <span>Customer Trust &amp; Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {contentBlock ? contentBlock.title : config.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {config.desc}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-4/6" />
          </div>
        ) : (
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line">
            {contentBlock?.content || 'Policy details will be loaded here.'}
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-slate-100 text-xs text-slate-500 text-center">
        Questions regarding our policies? Message our WhatsApp helpline at <strong>03432833991</strong> anytime.
      </div>

    </div>
  );
}
