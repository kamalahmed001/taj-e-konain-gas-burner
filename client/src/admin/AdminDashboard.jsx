import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatPKR } from '../utils/formatters';
import { 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  Flame, 
  Tags, 
  Mail, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Settings
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getDashboardStats();
        if (res && res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-28 bg-slate-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const data = stats || {
    totalProducts: 18,
    availableProducts: 18,
    outOfStock: 0,
    featuredProducts: 6,
    totalCategories: 10,
    totalInquiries: 0,
    recentProducts: [],
    categoryCounts: []
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time status of catalog inventory, product availability, and customer inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products?action=new"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>

          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 transition-colors shadow-2xs"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Store Settings</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-2xs font-bold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data.totalProducts}</div>
          <div className="text-2xs text-slate-500 font-medium">In database catalog</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-2xs font-bold uppercase tracking-wider">In Stock</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{data.availableProducts}</div>
          <div className="text-2xs text-emerald-600 font-medium">Available for order</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-2xs font-bold uppercase tracking-wider">Out of Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-700">{data.outOfStock}</div>
          <div className="text-2xs text-slate-400 font-medium">Need replenishment</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-orange-600">
            <span className="text-2xs font-bold uppercase tracking-wider">Featured</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-orange-700">{data.featuredProducts}</div>
          <div className="text-2xs text-slate-400 font-medium">Shown on homepage</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-2xs font-bold uppercase tracking-wider">Categories</span>
            <Tags className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-700">{data.totalCategories}</div>
          <div className="text-2xs text-slate-400 font-medium">Product groups</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-2xs font-bold uppercase tracking-wider">Inquiries</span>
            <Mail className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-700">{data.totalInquiries}</div>
          <div className="text-2xs text-slate-400 font-medium">Customer messages</div>
        </div>

      </div>

      {/* Main Dashboard Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recently Updated Products Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Recently Updated Products
            </h2>
            <Link to="/admin/products" className="text-xs font-bold text-orange-600 hover:underline">
              View All Products →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-2xs border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.recentProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {p.sku}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatPKR(p.price)}
                    </td>
                    <td className="py-3 px-4">
                      {p.stock_quantity} pcs
                    </td>
                    <td className="py-3 px-4">
                      {p.is_available && p.stock_quantity > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-amber-100 text-amber-800">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/products?edit=${p.id}`}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Categories Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Inventory by Category
            </h2>
            <Link to="/admin/categories" className="text-xs font-bold text-orange-600 hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {data.categoryCounts.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 truncate pr-2">{cat.name}</span>
                  <span className="text-slate-500 shrink-0">{cat.product_count} models</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (cat.product_count / Math.max(1, data.totalProducts)) * 100 * 3)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <a
              href="https://wa.me/923432833991"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-2.5 rounded-xl text-xs font-bold border border-emerald-200 transition-colors"
            >
              <span>Test WhatsApp Link (03432833991)</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
