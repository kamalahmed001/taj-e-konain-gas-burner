import React from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import WhatsAppOrderModal from '../cart/WhatsAppOrderModal';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { PhoneCall, CheckCircle } from 'lucide-react';

export default function MainLayout() {
  const { notification } = useCart();
  const { settings } = useSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <Navbar />

      {/* Cart Toast Notification */}
      {notification && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-slideUp">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Cart Drawer */}
      <CartDrawer />

      {/* Global WhatsApp Order Modal */}
      <WhatsAppOrderModal />

      {/* Persistent Floating WhatsApp Button */}
      <aside aria-label="WhatsApp Contact" className="fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${settings.whatsapp_number || '923432833991'}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Taj-e-Konain on WhatsApp"
          className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-3.5 rounded-full shadow-2xl hover:shadow-emerald-600/30 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white"
        >
          <div className="relative">
            <PhoneCall className="w-5 h-5 fill-current" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline font-bold">Chat on WhatsApp</span>
        </a>
      </aside>

      {/* Footer */}
      <Footer />
    </div>
  );
}
