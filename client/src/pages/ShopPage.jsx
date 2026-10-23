import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import SEOHelmet from '../components/common/SEOHelmet';
import { 
  Search, 
  Filter, 
  X, 
  Flame, 
  ArrowUpDown, 
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter and sort states synced with URL parameters
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({
            category: currentCategory,
            search: currentSearch,
            sort: currentSort,
            limit: 60
          }),
          api.getCategories()
        ]);

        if (prodRes && prodRes.success) {
          setProducts(prodRes.data || []);
        }

        if (catRes && catRes.success) {
          setCategories(catRes.data || []);
        }
      } catch (err) {
        console.error('Error fetching shop data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();
  }, [currentCategory, currentSearch, currentSort]);

  const handleCategorySelect = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set('search', e.target.value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setInStockOnly(false);
  };

  // Filter client-side for in-stock toggle
  const filteredProducts = products.filter(p => {
    if (inStockOnly) {
      return p.is_available && p.stock_quantity > 0;
    }
    return true;
  });

  const activeCategoryObj = categories.find(c => c.slug === currentCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* SEO Helmet */}
      <SEOHelmet
        title={activeCategoryObj ? `${activeCategoryObj.name} | Gas Stoves` : 'Shop Gas Stoves, Burners & Accessories'}
        description={`Browse quality gas stoves, double burners, stainless steel cooktops, built-in hobs, and safety accessories at Taj-e-Konain Gas Burner Pakistan.`}
        canonicalUrl={`/shop${currentCategory ? `?category=${currentCategory}` : ''}`}
      />

      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>Taj-e-Konain Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              {activeCategoryObj ? activeCategoryObj.name : 'All Products & Gas Stoves'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {activeCategoryObj?.description || 'Explore our complete selection of domestic stoves, commercial burners, LPG regulators, and spare parts. Order directly through WhatsApp.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-white border border-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter Categories</span>
            </button>
          </div>
        </div>

        {/* Search & Sort Controls Row */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Live Search Field */}
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search by stove name, SKU, or keyword..."
              value={currentSearch}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2.5 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {currentSearch && (
              <button
                onClick={() => handleSearchChange({ target: { value: '' } })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: In-Stock Checkbox & Sort Dropdown */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded-sm border-slate-300 focus:ring-orange-500"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold px-3 py-2.5 rounded-xl outline-hidden focus:border-orange-500"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

        </div>

        {/* Active Filters Pill Bar */}
        {(currentCategory || currentSearch || inStockOnly) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
            <span className="text-2xs font-bold text-slate-400 uppercase">Active Filters:</span>
            {currentCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                Category: {activeCategoryObj?.name || currentCategory}
                <button onClick={() => handleCategorySelect('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                Search: "{currentSearch}"
                <button onClick={() => handleSearchChange({ target: { value: '' } })}><X className="w-3 h-3" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:text-red-700 font-bold ml-2 underline"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Categories */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs sticky top-28">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                  !currentCategory
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>

              {categories.map((cat) => {
                const isActive = currentCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className={`text-2xs ${isActive ? 'text-orange-200' : 'text-slate-400'}`}>
                      {cat.product_count !== undefined ? cat.product_count : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200/80 text-xs text-orange-950 space-y-1.5">
              <span className="font-bold block">Need Custom Gas Fittings?</span>
              <p className="text-2xs text-slate-600">
                Can't find a specific nozzle size, brass tee, or regulator? Contact us on WhatsApp for custom requests.
              </p>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Showing <strong className="text-slate-900">{filteredProducts.length}</strong> available products</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-96 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                No matching products found
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any items matching your selected filters or search terms. Try adjusting your query.
              </p>
              <div>
                <button
                  onClick={clearAllFilters}
                  className="bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Filter by Category</h3>
                  <button onClick={() => setMobileFilterOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="mt-4 space-y-1">
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${!currentCategory ? 'bg-orange-600 text-white' : 'hover:bg-slate-100'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${currentCategory === cat.slug ? 'bg-orange-600 text-white' : 'hover:bg-slate-100'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-slate-900 text-white text-xs font-bold py-3 rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
