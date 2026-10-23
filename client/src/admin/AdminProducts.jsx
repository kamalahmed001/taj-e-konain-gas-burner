import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { formatPKR } from '../utils/formatters';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Flame, 
  CheckCircle,
  Eye,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form inputs
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    price: '',
    discount_price: '',
    stock_quantity: 10,
    is_available: true,
    is_featured: false,
    is_published: true,
    primary_image: '',
    short_description: '',
    description: '',
    meta_title: '',
    meta_description: '',
    specifications: {}
  });

  const [specsText, setSpecsText] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ admin: true, limit: 100 }),
        api.getCategories()
      ]);

      if (prodRes && prodRes.success) {
        setProducts(prodRes.data || []);
      }
      if (catRes && catRes.success) {
        setCategories(catRes.data || []);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle URL query triggers (e.g. ?action=new or ?edit=ID)
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'new') {
      openCreateForm();
    } else if (editId && products.length > 0) {
      const p = products.find(x => x.id === Number(editId));
      if (p) openEditForm(p);
    }
  }, [searchParams, products]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `TK-${Math.floor(100 + Math.random() * 900)}`,
      category_id: categories.length > 0 ? categories[0].id : '',
      price: '',
      discount_price: '',
      stock_quantity: 10,
      is_available: true,
      is_featured: false,
      is_published: true,
      primary_image: '/images/products/p1-double-burner-glass.svg',
      short_description: '',
      description: '',
      meta_title: '',
      meta_description: '',
      specifications: {}
    });
    setSpecsText('Body Material: Tempered Glass\nBurners: 2 Brass Burners\nGas Type: Sui Gas / LPG');
    setIsFormOpen(true);
  };

  const openEditForm = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      sku: p.sku || '',
      category_id: p.category_id || '',
      price: p.price || '',
      discount_price: p.discount_price || '',
      stock_quantity: p.stock_quantity ?? 10,
      is_available: Boolean(p.is_available),
      is_featured: Boolean(p.is_featured),
      is_published: Boolean(p.is_published),
      primary_image: p.primary_image || '',
      short_description: p.short_description || '',
      description: p.description || '',
      meta_title: p.meta_title || '',
      meta_description: p.meta_description || '',
      specifications: p.specifications || {}
    });

    // Format specs to textarea key: value format
    if (p.specifications && typeof p.specifications === 'object') {
      const lines = Object.entries(p.specifications).map(([k, v]) => `${k}: ${v}`);
      setSpecsText(lines.join('\n'));
    } else {
      setSpecsText('');
    }

    setIsFormOpen(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      if (res && res.success && res.url) {
        setFormData(prev => ({ ...prev, primary_image: res.url }));
        showToast('Image uploaded successfully from your computer!');
      } else {
        alert(res?.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Parse specsText into object
    const parsedSpecs = {};
    specsText.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        if (key && val) parsedSpecs[key] = val;
      }
    });

    const payload = {
      ...formData,
      price: Number(formData.price),
      discount_price: formData.discount_price ? Number(formData.discount_price) : null,
      stock_quantity: Number(formData.stock_quantity),
      specifications: parsedSpecs,
      images: [formData.primary_image]
    };

    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, payload);
        if (res && res.success) {
          showToast(`Product "${payload.name}" updated!`);
          setIsFormOpen(false);
          loadData();
        } else {
          alert(res?.message || 'Failed to update product');
        }
      } else {
        const res = await api.createProduct(payload);
        if (res && res.success) {
          showToast(`Product "${payload.name}" created!`);
          setIsFormOpen(false);
          loadData();
        } else {
          alert(res?.message || 'Failed to create product');
        }
      }
    } catch (err) {
      console.error('Save product error:', err);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.deleteProduct(id);
      if (res && res.success) {
        showToast('Product deleted.');
        setDeleteConfirmId(null);
        loadData();
      } else {
        alert(res?.message || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product');
    }
  };

  const toggleFeatured = async (p) => {
    try {
      await api.updateProduct(p.id, { is_featured: !p.is_featured });
      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_featured: !item.is_featured } : item));
      showToast(`Updated featured status for "${p.name}"`);
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const togglePublished = async (p) => {
    try {
      await api.updateProduct(p.id, { is_published: !p.is_published });
      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_published: !item.is_published } : item));
      showToast(`Updated publish status for "${p.name}"`);
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = !selectedCategory || String(p.category_id) === String(selectedCategory);
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-slideUp">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, upload photos, and update prices &amp; inventory for your storefront.
          </p>
        </div>

        <div>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-hidden"
          >
            <option value="">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <span className="text-xs text-slate-500 whitespace-nowrap">
            {filteredProducts.length} items
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-2xs border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Product Name &amp; SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (PKR)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg p-1 flex items-center justify-center">
                      <img
                        src={p.primary_image || '/images/logo-icon.svg'}
                        alt=""
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = '/images/logo-icon.svg'; }}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 truncate">{p.name}</div>
                    <div className="text-2xs font-mono text-slate-400 mt-0.5">SKU: {p.sku}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-2xs font-semibold bg-slate-100 px-2 py-0.5 rounded-full text-slate-700">
                      {p.category_name || 'Unassigned'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{formatPKR(p.discount_price || p.price)}</div>
                    {p.discount_price && (
                      <div className="text-2xs text-slate-400 line-through">{formatPKR(p.price)}</div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`font-bold ${p.stock_quantity > 0 ? 'text-slate-900' : 'text-red-600'}`}>
                      {p.stock_quantity}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleFeatured(p)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                        p.is_featured ? 'text-orange-600 bg-orange-50' : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title="Toggle homepage featured"
                    >
                      <Flame className="w-4 h-4" />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => togglePublished(p)}
                      className={`px-2 py-0.5 rounded-full text-2xs font-bold transition-colors ${
                        p.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {p.is_published ? 'Live' : 'Hidden'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <a
                      href={`/product/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-600 inline-block"
                      title="Preview live product page"
                    >
                      <Eye className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => openEditForm(p)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 inline-block"
                      title="Edit product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 inline-block"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-base">Confirm Product Deletion</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to permanently delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-2xs" onClick={() => setIsFormOpen(false)} />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 z-10 max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Gas Stove / Appliance'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Product Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-orange-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">SKU / Model *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:border-orange-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-orange-500 outline-hidden"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:bg-white focus:border-orange-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Sale Price (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Discounted PKR"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-orange-600 focus:bg-white focus:border-orange-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Stock Quantity & Status Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded-sm"
                  />
                  <label htmlFor="is_available" className="text-xs font-bold text-slate-800">In Stock</label>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded-sm"
                  />
                  <label htmlFor="is_featured" className="text-xs font-bold text-slate-800">Featured (Home)</label>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded-sm"
                  />
                  <label htmlFor="is_published" className="text-xs font-bold text-slate-800">Published (Visible)</label>
                </div>
              </div>

              {/* Image Management & File Upload from Windows Computer */}
              <div className="space-y-2 border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Product Image</span>
                  <span className="text-slate-400 font-normal">Upload from computer or specify path</span>
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center shrink-0">
                    <img
                      src={formData.primary_image || '/images/logo-icon.svg'}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.src = '/images/logo-icon.svg'; }}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="/images/products/... or /uploads/..."
                      value={formData.primary_image}
                      onChange={(e) => setFormData({ ...formData, primary_image: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-hidden"
                    />

                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Choose File from Windows PC'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-2xs text-slate-400">PNG, JPG, WebP, SVG (Max 5MB)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Short & Long Description */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Short Summary</label>
                  <input
                    type="text"
                    placeholder="One-line summary for product card..."
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Full Description</label>
                  <textarea
                    rows={3}
                    placeholder="Detailed description of burner materials, warranty, cooking performance..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Specifications (Key: Value per line) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Specifications (Format: "Key: Value" per line)</span>
                  <span className="text-2xs text-slate-400">e.g. "Body Material: 7mm Glass"</span>
                </label>
                <textarea
                  rows={4}
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  className="w-full font-mono text-xs px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                />
              </div>

              {/* SEO Title & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">SEO Meta Title</label>
                  <input
                    type="text"
                    placeholder="Product Title - Taj-e-Konain"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">SEO Meta Description</label>
                  <input
                    type="text"
                    placeholder="Meta description for Google search..."
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-extrabold bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
