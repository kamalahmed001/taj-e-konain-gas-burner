import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/product/ProductCard';
import SEOHelmet from '../components/common/SEOHelmet';
import { 
  Flame, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Star, 
  ChevronDown, 
  Sparkles,
  CheckCircle,
  HelpCircle,
  Compass
} from 'lucide-react';
import { formatPhone, getImageUrl } from '../utils/formatters';

export default function HomePage() {
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prodRes, catRes, testRes, faqRes] = await Promise.all([
          api.getProducts({ limit: 12 }),
          api.getCategories(),
          api.getTestimonials(),
          api.getFaqs()
        ]);

        if (prodRes && prodRes.success) {
          const all = prodRes.data || [];
          setFeaturedProducts(all.filter(p => p.is_featured).slice(0, 8));
          // Filter accessories (regulators, hoses, parts, etc.)
          setAccessories(all.filter(p => 
            p.category_slug?.includes('regulator') || 
            p.category_slug?.includes('hose') || 
            p.category_slug?.includes('accessories') ||
            p.category_slug?.includes('parts')
          ).slice(0, 4));
        }

        if (catRes && catRes.success) {
          setCategories(catRes.data || []);
        }

        if (testRes && testRes.success) {
          setTestimonials(testRes.data || []);
        }

        if (faqRes && faqRes.success) {
          setFaqs(faqRes.data ? faqRes.data.slice(0, 6) : []);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* SEO Head Tags */}
      <SEOHelmet
        title={settings.hero_headline || 'Quality Gas Stoves & Kitchen Essentials for Every Home'}
        description={settings.meta_description_default}
        canonicalUrl="/"
      />

      {/* 1. HERO SECTION */}
      <section 
        className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 sm:pb-28"
        style={settings.hero_bg_image ? {
          backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.88), rgba(15, 23, 42, 0.94)), url(${getImageUrl(settings.hero_bg_image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        
        {/* Decorative background glow */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-semibold shadow-inner">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>{settings.hero_badge_text || 'Pakistani Gas Burner Specialists • Sui Gas & LPG Ready'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
                {settings.hero_headline || 'Quality Gas Stoves & Kitchen Essentials for Every Home'}
              </h1>

              {/* Supporting Subtext */}
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {settings.hero_subtext || 'Discover reliable gas burners, stylish stoves, and essential kitchen accessories at Taj-e-Konain Gas Burner. Explore our collection and order conveniently through WhatsApp.'}
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-base px-7 py-4 rounded-xl shadow-lg hover:shadow-orange-600/30 transition-all duration-300 hover:scale-102 active:scale-98"
                >
                  <span>Explore All Stoves</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href={`https://wa.me/${settings.whatsapp_number || '923432833991'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base px-7 py-4 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 hover:scale-102 active:scale-98"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>WhatsApp Order ({formatPhone(settings.phone_number || '03432833991')})</span>
                </a>
              </div>

              {/* Micro-Features */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-800/80 text-left">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Heavy Cast Iron</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pure Brass Burners</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pakistan Courier</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-900/90 shadow-2xl p-4">
                <img
                  src={getImageUrl(settings.hero_image, '/images/hero-banner.svg')}
                  alt={settings.hero_headline || "Taj-e-Konain Gas Burner Kitchen Stoves"}
                  className="w-full h-auto object-cover rounded-2xl"
                  onError={(e) => { e.target.src = '/images/hero-banner.svg'; }}
                />
                
                {/* Float Card */}
                <div className="absolute -bottom-3 -left-3 bg-slate-950/95 backdrop-blur-md border border-orange-500/40 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Blue Flame Heat</div>
                    <div className="text-sm font-black text-white">Save Gas • Fast Boil</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-extrabold text-xs tracking-wider uppercase">
              <Compass className="w-4 h-4" />
              <span>Browse by Category</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Popular Stove Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 group"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.slug)}`}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-orange-500/60 p-4 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-2.5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img
                  src={getImageUrl(cat.image_url, '/images/taj-logo.png')}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = '/images/taj-logo.png'; }}
                />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-2xs text-slate-400 mt-0.5 block">
                  {cat.product_count !== undefined ? `${cat.product_count} Models` : 'Explore'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST-SELLING STOVES & BURNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-extrabold text-xs tracking-wider uppercase">
              <Flame className="w-4 h-4" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Best-Selling Stoves &amp; Burners
            </h2>
          </div>
          <Link
            to="/shop?sort=featured"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 group"
          >
            <span>See All Best Sellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-96 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. PROMOTIONAL FEATURE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 border border-slate-800 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-orange-600/30 text-orange-400 border border-orange-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Special Kitchen Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Sui Gas &amp; LPG Cylinder Ready For Uninterrupted Cooking
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tired of low gas pressure during peak meal times? Our stoves feature high-efficiency brass nozzles and dual-fuel compatibility. Seamlessly switch between natural Sui Gas and LPG cylinders whenever needed.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-colors"
              >
                Browse Stoves Now
              </Link>
              <a
                href={`https://wa.me/${settings.whatsapp_number || '923432833991'}?text=Assalam-o-Alaikum,%20I%20need%20advice%20regarding%20gas%20stoves%20for%20low%20gas%20pressure`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Ask Advice on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RECOMMENDED ACCESSORIES & REPLACEMENT PARTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-extrabold text-xs tracking-wider uppercase">
              <Wrench className="w-4 h-4" />
              <span>Safety &amp; Spares</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Recommended Accessories &amp; Safety Spares
            </h2>
          </div>
          <Link
            to="/shop?category=gas-regulators"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 group"
          >
            <span>All Accessories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessories.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE TAJ-E-KONAIN */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-orange-600 font-extrabold text-xs tracking-wider uppercase">
              The Taj-e-Konain Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Why Customers Choose Taj-e-Konain
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Engineering quality, customer safety, and honest Pakistani service built into every burner we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                High Thermal Efficiency
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Precision brass burner caps produce a concentrated blue flame with complete combustion. This boils water and cooks food faster while cutting monthly gas and cylinder refill expenses.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Heavy-Duty Pakistani Build
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Engineered to handle heavy traditional cooking utensils, including large biryani deghs, steel pressure cookers, and thick iron karahis without wobbling or bending.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <PhoneCall className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Personal WhatsApp Service
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No complicated checkout forms. You speak directly with our team on WhatsApp (03432833991) to discuss nozzles, delivery options, and receive photos of products before dispatch.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS (With Sample Indicator) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-orange-600 font-extrabold text-xs tracking-wider uppercase">
            Customer Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            What Our Customers Say
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            * Demonstration reviews shown below illustrate customer satisfaction feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{t.review_text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="font-bold text-slate-900 text-sm">
                  {t.customer_name}
                </div>
                <div className="text-xs text-slate-500">
                  {t.customer_location || 'Pakistan'}
                </div>
                {t.product_purchased && (
                  <div className="text-2xs text-orange-600 font-medium mt-1 truncate">
                    Purchased: {t.product_purchased}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-orange-600 font-extrabold text-xs tracking-wider uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quick answers about gas compatibility, delivery across Pakistan, and WhatsApp ordering.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id || idx}
              className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-orange-600 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-orange-600' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to="/faq" className="text-xs font-bold text-orange-600 hover:underline">
            View All Frequently Asked Questions →
          </Link>
        </div>
      </section>

      {/* 9. WHATSAPP CONTACT ACTION CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border border-emerald-900/50 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-600/30 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <PhoneCall className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Ready to Order or Have a Question?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Message us directly on WhatsApp. We provide instant assistance with stove dimensions, burner options, nozzle sizes, and shipping fees.
            </p>
          </div>

          <div>
            <a
              href={`https://wa.me/${settings.whatsapp_number || '923432833991'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-emerald-600/40 transition-all hover:scale-103 active:scale-97"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Chat on WhatsApp: {formatPhone(settings.phone_number || '03432833991')}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
