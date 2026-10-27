import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { getImageUrl } from '../../utils/formatters';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  PhoneCall, 
  Flame, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Products', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact & Store', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-12 h-12 rounded-full bg-slate-950 border-2 border-amber-500/60 p-0.5 flex items-center justify-center shadow-md overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <img 
                src={getImageUrl(settings.logo_url, '/images/taj-logo.png')} 
                alt={settings.store_name || "Taj-e-Konain"} 
                className="w-full h-full object-cover rounded-full" 
                onError={(e) => { e.target.src = '/images/taj-logo.png'; }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                {settings.store_name ? settings.store_name.toUpperCase() : 'TAJ-E-KONAIN'}
              </span>
              <span className="text-xs font-extrabold tracking-widest text-orange-600 mt-1 uppercase">
                GAS BURNER &amp; APPLIANCES
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search stoves, hobs, regulators, spare parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 text-sm rounded-full border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'text-orange-600 bg-orange-50/80 font-bold'
                      : 'text-slate-700 hover:text-orange-600 hover:bg-slate-100/70'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct WhatsApp Callout Pill */}
            <a
              href={`https://wa.me/${settings.whatsapp_number || '923432833991'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-full shadow-xs hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Row */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search gas stoves, hobs, accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2 bg-slate-100 text-slate-900 text-sm rounded-full border border-slate-200 focus:border-orange-500 focus:bg-white outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button 
              type="submit" 
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-xl animate-fadeIn">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 font-bold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`
                }
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
            ))}

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <a
                href={`https://wa.me/${settings.whatsapp_number || '923432833991'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-sm"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Order on WhatsApp (03432833991)</span>
              </a>

              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 py-2 hover:text-slate-700"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Store Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
