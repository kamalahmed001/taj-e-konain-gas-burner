import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { 
  Flame, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Lock, 
  ExternalLink 
} from 'lucide-react';
import { formatPhone, getImageUrl } from '../../utils/formatters';

export default function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Pure Blue Flame</h4>
              <p className="text-xs text-slate-400 mt-0.5">High thermal efficiency brass burners designed for Sui Gas &amp; LPG cylinders.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Pakistan Nationwide Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Reliable courier delivery with transit protection for heavy gas equipment.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Safety Certified Accessories</h4>
              <p className="text-xs text-slate-400 mt-0.5">Steel-wire braided hoses, meter regulators &amp; leak-tested brass joints.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Direct WhatsApp Service</h4>
              <p className="text-xs text-slate-400 mt-0.5">Order directly, get advice on gas pressure nozzles, and track dispatch.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-500/60 p-0.5 flex items-center justify-center overflow-hidden shadow-lg">
                <img 
                  src={getImageUrl(settings.logo_url, '/images/taj-logo.png')} 
                  alt={settings.store_name || "Taj-e-Konain"} 
                  className="w-full h-full object-cover rounded-full" 
                  onError={(e) => { e.target.src = '/images/taj-logo.png'; }}
                />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">{settings.store_name ? settings.store_name.toUpperCase() : 'TAJ-E-KONAIN'}</span>
                <span className="block text-xs font-bold text-orange-500 tracking-wider">GAS BURNER &amp; APPLIANCES</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your dependable Pakistani source for heavy-duty gas stoves, stylish tempered glass hobs, commercial restaurant burners, and safety-tested gas accessories. Built for robust cooking and fuel efficiency.
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsapp_number || '923432833991'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp: {formatPhone(settings.phone_number || '03432833991')}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=double-burner-gas-stoves" className="hover:text-orange-400 transition-colors">
                  Double Burner Stoves
                </Link>
              </li>
              <li>
                <Link to="/shop?category=three-burner-gas-stoves" className="hover:text-orange-400 transition-colors">
                  3-Burner Kitchen Stoves
                </Link>
              </li>
              <li>
                <Link to="/shop?category=built-in-gas-hobs" className="hover:text-orange-400 transition-colors">
                  Built-In Counter Hobs
                </Link>
              </li>
              <li>
                <Link to="/shop?category=stainless-steel-gas-stoves" className="hover:text-orange-400 transition-colors">
                  Stainless Steel Stoves
                </Link>
              </li>
              <li>
                <Link to="/shop?category=commercial-burners" className="hover:text-orange-400 transition-colors">
                  Commercial &amp; Hotel Burners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=gas-regulators" className="hover:text-orange-400 transition-colors">
                  Gas Regulators &amp; Meters
                </Link>
              </li>
              <li>
                <Link to="/shop?category=burner-heads-accessories" className="hover:text-orange-400 transition-colors">
                  Burner Caps &amp; Trivets
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Customer Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">
                  Contact &amp; Store Location
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-orange-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-orange-400 transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-orange-400 transition-colors">
                  Returns &amp; Refunds Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-orange-400 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Store Information
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-medium leading-snug">
                    {settings.address || 'House no.13/3 H area near, main Liaqat Market Rd, Model Colony H Area malir, Karachi, 75050'}
                  </span>
                  {settings.google_maps_url && (
                    <a
                      href={settings.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-2xs text-orange-400 hover:text-orange-300 font-semibold mt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{formatPhone(settings.phone_number || '03432833991')}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{settings.business_hours || 'Mon - Sat: 9:00 AM - 9:00 PM'}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500 block mb-2">Order Method:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Direct WhatsApp Checkout
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} Taj-e-Konain Gas Burner. All rights reserved. Primary Market: Pakistan.
          </div>

          <div className="flex items-center gap-4">
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">
              Sitemap.xml
            </a>
            <span>•</span>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">
              Robots.txt
            </a>
            <span>•</span>
            <Link to="/admin/login" className="flex items-center gap-1 text-slate-400 hover:text-orange-400 transition-colors">
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
