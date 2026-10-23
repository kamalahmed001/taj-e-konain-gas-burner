import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Flame, Home, ShoppingBag, ArrowLeft, PhoneCall } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Helmet>
        <title>404 Page Not Found | Taj-e-Konain Gas Burner</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-orange-600 shadow-md">
          <Flame className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-6xl font-black text-slate-900 block">404</span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">Page Not Found</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page you are looking for does not exist or may have been moved. Let's get you back on track!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl border border-slate-300 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <a
            href="https://wa.me/923432833991"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Need assistance? WhatsApp us directly at 03432833991</span>
          </a>
        </div>
      </div>
    </div>
  );
}
