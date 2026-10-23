import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import SEOHelmet from '../components/common/SEOHelmet';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  PhoneCall, 
  Flame, 
  X 
} from 'lucide-react';
import { formatPhone } from '../utils/formatters';

export default function FAQPage() {
  const { settings } = useSettings();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await api.getFaqs();
        if (res && res.success) {
          setFaqs(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load faqs:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFaqs();
  }, []);

  const categories = ['All', ...new Set(faqs.map(f => f.category || 'General'))];

  const filteredFaqs = faqs.filter(f => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch = !search || 
      f.question.toLowerCase().includes(search.toLowerCase()) || 
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* SEO Helmet */}
      <SEOHelmet
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions about gas stoves, Sui gas and LPG compatibility, nationwide delivery in Pakistan, and WhatsApp ordering."
        canonicalUrl="/faq"
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 uppercase tracking-wider bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge &amp; Support</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Everything you need to know about purchasing, maintaining, and using gas stoves and kitchen accessories from Taj-e-Konain.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search questions (e.g. LPG, delivery, yellow flame)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-white text-slate-900 text-sm rounded-2xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden shadow-xs"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="h-16 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <h3 className="text-base font-bold text-slate-800">No questions found</h3>
            <p className="text-xs text-slate-500">Try searching with a different keyword or contact us on WhatsApp directly.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <div
              key={faq.id || idx}
              className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-orange-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600 shrink-0">
                    <Flame className="w-4 h-4" />
                  </span>
                  <span>{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openIndex === idx ? 'rotate-180 text-orange-600' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom WhatsApp Callout */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4">
        <h3 className="text-xl font-black text-white">Still Have Questions?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Our friendly stove technicians and customer support team are available on WhatsApp to answer any query.
        </p>
        <div>
          <a
            href={`https://wa.me/${settings.whatsapp_number || '923432833991'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Ask on WhatsApp: {formatPhone(settings.phone_number || '03432833991')}</span>
          </a>
        </div>
      </div>

    </div>
  );
}
