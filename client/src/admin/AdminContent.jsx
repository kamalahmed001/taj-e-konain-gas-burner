import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Save, Plus, Edit, Trash2, X, CheckCircle, FileText, HelpCircle } from 'lucide-react';

const pages = [
  { key: 'about', label: 'About Us Page', section_key: 'story' },
  { key: 'shipping', label: 'Shipping & Delivery Policy', section_key: 'policy' },
  { key: 'returns', label: 'Returns & Refund Policy', section_key: 'policy' },
  { key: 'privacy', label: 'Privacy Policy', section_key: 'policy' },
  { key: 'terms', label: 'Terms & Conditions', section_key: 'policy' },
];

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('about');
  const [contentTitle, setContentTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // FAQs state
  const [faqs, setFaqs] = useState([]);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'General', display_order: 0 });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadContent = async (pageKey) => {
    try {
      const res = await api.getContent(pageKey);
      if (res && res.success && res.data && res.data.length > 0) {
        setContentTitle(res.data[0].title || '');
        setContentText(res.data[0].content || '');
      } else {
        setContentTitle('');
        setContentText('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadFaqs = async () => {
    try {
      const res = await api.getAdminFaqs();
      if (res && res.success) {
        setFaqs(res.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === 'faqs') {
      loadFaqs();
    } else {
      loadContent(activeTab);
    }
  }, [activeTab]);

  const handleSaveContent = async (e) => {
    e.preventDefault();
    setSaving(true);
    const pageObj = pages.find(p => p.key === activeTab);
    try {
      const res = await api.updateContentBlock(activeTab, pageObj.section_key, {
        title: contentTitle,
        content: contentText
      });
      if (res && res.success) {
        showToast('Page content saved successfully!');
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      alert('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await api.updateFaq(editingFaq.id, faqForm);
        showToast('FAQ updated');
      } else {
        await api.createFaq(faqForm);
        showToast('FAQ created');
      }
      setIsFaqModalOpen(false);
      loadFaqs();
    } catch (e) {
      alert('Error saving FAQ');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm('Delete this FAQ?')) {
      await api.deleteFaq(id);
      showToast('FAQ deleted');
      loadFaqs();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-slideUp">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Content &amp; Policy Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Edit About Us story, customer policies, and frequently asked questions without touching code.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {pages.map((p) => (
          <button
            key={p.key}
            onClick={() => setActiveTab(p.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === p.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}

        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'faqs'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white text-orange-600 hover:bg-orange-50 border border-orange-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Manage FAQs</span>
        </button>
      </div>

      {/* Policy / About Content Tab View */}
      {activeTab !== 'faqs' ? (
        <form onSubmit={handleSaveContent} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Section Title</label>
            <input
              type="text"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-xs font-bold outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Page Content (Supports Markdown / Text)</label>
            <textarea
              rows={12}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              className="w-full p-4 bg-slate-50 border rounded-xl text-xs leading-relaxed outline-hidden font-mono"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Page Content'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* FAQs Management View */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Frequently Asked Questions ({faqs.length})</h3>
              <p className="text-2xs text-slate-500">Rendered on homepage and FAQ page.</p>
            </div>
            <button
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({ question: '', answer: '', category: 'General', display_order: faqs.length + 1 });
                setIsFaqModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{f.category}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{f.question}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.answer}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingFaq(f);
                      setFaqForm({ question: f.question, answer: f.answer, category: f.category, display_order: f.display_order });
                      setIsFaqModalOpen(true);
                    }}
                    className="p-1.5 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteFaq(f.id)} className="p-1.5 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Modal */}
          {isFaqModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-slate-950/70" onClick={() => setIsFaqModalOpen(false)} />
              <div className="relative bg-white rounded-2xl p-6 max-w-md w-full z-10 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-slate-900 text-base">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h3>
                  <button onClick={() => setIsFaqModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>

                <form onSubmit={handleSaveFaq} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Question *</label>
                    <input
                      type="text"
                      required
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Answer *</label>
                    <textarea
                      rows={4}
                      required
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Category</label>
                      <input
                        type="text"
                        value={faqForm.category}
                        onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Display Order</label>
                      <input
                        type="number"
                        value={faqForm.display_order}
                        onChange={(e) => setFaqForm({ ...faqForm, display_order: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t">
                    <button type="button" onClick={() => setIsFaqModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600">Cancel</button>
                    <button type="submit" className="px-5 py-2 text-xs font-bold bg-orange-600 text-white rounded-xl">Save FAQ</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
