import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit, Trash2, X, Star, CheckCircle } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_location: '',
    rating: 5,
    review_text: '',
    product_purchased: '',
    is_sample: false,
    is_published: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminTestimonials();
      if (res && res.success) {
        setTestimonials(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      customer_name: '',
      customer_location: 'Pakistan',
      rating: 5,
      review_text: '',
      product_purchased: '',
      is_sample: false,
      is_published: true
    });
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      customer_name: item.customer_name || '',
      customer_location: item.customer_location || '',
      rating: item.rating || 5,
      review_text: item.review_text || '',
      product_purchased: item.product_purchased || '',
      is_sample: Boolean(item.is_sample),
      is_published: Boolean(item.is_published)
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateTestimonial(editingItem.id, formData);
        showToast('Testimonial updated');
      } else {
        await api.createTestimonial(formData);
        showToast('Testimonial added');
      }
      setIsModalOpen(false);
      loadData();
    } catch (e) {
      alert('Error saving testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      await api.deleteTestimonial(id);
      showToast('Deleted');
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-slideUp">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Testimonials
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage genuine customer reviews or demonstration placeholders.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-2xs border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Review Text</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {testimonials.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">{t.customer_name}</td>
                <td className="py-3 px-4 text-slate-500">{t.customer_location || '—'}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="ml-1 font-bold">{t.rating}</span>
                  </div>
                </td>
                <td className="py-3 px-4 max-w-xs truncate text-slate-600">"{t.review_text}"</td>
                <td className="py-3 px-4">
                  {t.is_sample ? (
                    <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-amber-100 text-amber-800">
                      Sample Data
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-100 text-emerald-800">
                      Genuine
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-2xs font-bold ${t.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                    {t.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => openEdit(t)} className="p-1.5 text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full z-10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">{editingItem ? 'Edit Review' : 'Add Review'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Location</label>
                  <input
                    type="text"
                    value={formData.customer_location}
                    onChange={(e) => setFormData({ ...formData, customer_location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Rating (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Product Purchased</label>
                  <input
                    type="text"
                    value={formData.product_purchased}
                    onChange={(e) => setFormData({ ...formData, product_purchased: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Review Text *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden resize-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_sample}
                    onChange={(e) => setFormData({ ...formData, is_sample: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded-sm"
                  />
                  <span>Mark as Sample Demo Review</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded-sm"
                  />
                  <span>Published (Live)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-orange-600 text-white rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
