import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { getProductOrderUrl } from '../services/whatsapp';
import { formatPKR } from '../utils/formatters';
import ProductCard from '../components/product/ProductCard';
import SEOHelmet from '../components/common/SEOHelmet';
import { 
  ShoppingBag, 
  PhoneCall, 
  Flame, 
  ChevronRight, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  Share2, 
  Plus, 
  Minus,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getProduct(slug);
        if (res && res.success && res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.primary_image || (res.data.images && res.data.images[0]) || '/images/logo-icon.svg');
          setRelated(res.related || []);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Error loading product details');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-4/3 bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded" />
            <div className="h-12 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">
          The gas stove or accessory you were looking for is currently unavailable or may have been moved.
        </p>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shop Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const price = Number(product.price);
  const discountPrice = product.discount_price ? Number(product.discount_price) : null;
  const currentPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;
  const isAvailable = product.is_available && product.stock_quantity > 0;

  const imagesList = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.primary_image || '/images/logo-icon.svg'];

  const handleWhatsAppOrder = () => {
    const orderUrl = getProductOrderUrl({
      product,
      quantity,
      phoneNumber: settings.whatsapp_number || '923432833991',
      storeName: settings.store_name || 'Taj-e-Konain Gas Burner'
    });
    window.open(orderUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    if (isAvailable) {
      addToCart(product, quantity);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Taj-e-Konain Gas Burner!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    ...(product.category_slug ? [{ name: product.category_name || 'Category', url: `/shop?category=${product.category_slug}` }] : []),
    { name: product.name, url: `/product/${product.slug}` }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      
      {/* SEO Helmet with structured Product data */}
      <SEOHelmet
        title={product.meta_title || product.name}
        description={product.meta_description || product.short_description || product.description}
        canonicalUrl={`/product/${product.slug}`}
        imageUrl={selectedImage}
        type="product"
        product={product}
        breadcrumbs={breadcrumbs}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap py-1">
        <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400 shrink-0" />
        <Link to="/shop" className="hover:text-orange-600 transition-colors">Shop</Link>
        {product.category_slug && (
          <>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400 shrink-0" />
            <Link to={`/shop?category=${product.category_slug}`} className="hover:text-orange-600 transition-colors">
              {product.category_name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        
        {/* Left: Product Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 w-full bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 flex items-center justify-center relative overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-300"
              onError={(e) => { e.target.src = '/images/logo-icon.svg'; }}
            />

            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                SAVE {Math.round(((price - discountPrice) / price) * 100)}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl bg-white border p-1.5 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-orange-500 ring-2 ring-orange-500/30'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Support Box */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Truck className="w-4 h-4 text-orange-600" />
              <span>Nationwide Pakistan Courier Delivery</span>
            </div>
            <p className="text-2xs text-slate-500">
              Delivery charges are determined per parcel weight and location. We confirm shipping costs directly over WhatsApp before dispatch.
            </p>
          </div>
        </div>

        {/* Right: Product Buy Box & Details */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="bg-orange-50 text-orange-700 font-bold px-2.5 py-0.5 rounded-full border border-orange-200/80">
                {product.category_name || 'Gas Burner'}
              </span>
              <span className="font-mono text-slate-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing Row */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatPKR(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-base text-slate-400 line-through">
                  {formatPKR(price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 pt-1 text-xs">
              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>In Stock ({product.stock_quantity} available)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                  <span>Out of Stock</span>
                </span>
              )}
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium">All Prices in Pakistani Rupees (PKR)</span>
            </div>
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Quantity Selector + Add to Cart + WhatsApp Order */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2.5 hover:text-orange-600 disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-extrabold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity || 99, quantity + 1))}
                  disabled={quantity >= (product.stock_quantity || 99)}
                  className="p-2.5 hover:text-orange-600 disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              {/* Primary: Order on WhatsApp */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-lg hover:shadow-emerald-600/30 transition-all duration-200 active:scale-98"
              >
                <PhoneCall className="w-5 h-5 fill-current" />
                <span>Order on WhatsApp</span>
              </button>

              {/* Secondary: Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-base py-4 px-6 rounded-2xl shadow-md transition-all duration-200 active:scale-98"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Share and Note */}
            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Direct WhatsApp Customer Support</span>
              </span>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-slate-600 hover:text-orange-600 font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
              </button>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="border-t border-slate-200 pt-6 space-y-3">
              <h2 className="text-base font-black text-slate-900">
                Specifications &amp; Features
              </h2>
              <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 bg-white">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 text-xs p-3 sm:px-4">
                    <span className="font-bold text-slate-600">{key}</span>
                    <span className="text-slate-900 font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Description */}
          {product.description && (
            <div className="border-t border-slate-200 pt-6 space-y-3">
              <h2 className="text-base font-black text-slate-900">
                Product Details
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-2 whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="border-t border-slate-200 pt-12 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Related Stoves &amp; Accessories
            </h2>
            <Link to="/shop" className="text-xs font-bold text-orange-600 hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
