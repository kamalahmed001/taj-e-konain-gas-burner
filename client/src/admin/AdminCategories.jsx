import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit, Trash2, X, CheckCircle, Tags, Upload } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    display_order: 0
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      if (res && res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image_url: '/images/categories/cat-double-burners.svg',
      display_order: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image_url: cat.image_url || '',
      display_order: cat.display_order || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await api.updateCategory(editingCategory.id, formData);
        if (res && res.success) {
          showToast('Category updated!');
          setIsModalOpen(false);
          loadCategories();
        } else {
          alert(res?.message || 'Update failed');
        }
      } else {
        const res = await api.createCategory(formData);
        if (res && res.success) {
          showToast('Category created!');
          setIsModalOpen(false);
          loadCategories();
        } else {
          alert(res?.message || 'Create failed');
        }
      }
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Error saving category');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.deleteCategory(id);
      if (res && res.success) {
        showToast('Category deleted');
        setDeleteConfirmId(null);
        loadCategories();
      } else {
        alert(res?.message || 'Delete failed');
      }
    } catch (err) {
      alert('Error deleting category');
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
            Category Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize products into logical groups for storefront navigation and SEO filters.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-2xs border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Products</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg p-1 flex items-center justify-center">
                    <img src={c.image_url || '/images/logo-icon.svg'} alt="" className="w-full h-full object-contain" />
                  </div>
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">
                  {c.name}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  {c.slug}
                </td>
                <td className="py-3 px-4 max-w-xs truncate text-slate-500">
                  {c.description || '—'}
                </td>
                <td className="py-3 px-4 font-bold">
                  {c.display_order}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-slate-100 text-slate-700">
                    {c.product_count || 0}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteConfirmId(c.id)} className="p-1.5 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-base">Delete Category?</h3>
            <p className="text-xs text-slate-500">
              Products in this category will remain, but will become unassigned.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full z-10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Image Path</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-sm">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
