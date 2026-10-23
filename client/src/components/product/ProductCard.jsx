import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { getProductOrderUrl } from '../../services/whatsapp';
import { formatPKR } from '../../utils/formatters';
import { 
  ShoppingBag, 
  MessageSquare, 
  Flame, 
  Check, 
  Eye,
  ShieldCheck
} from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const price = Number(product.price);
  const discountPrice = product.discount_price ? Number(product.discount_price) : null;
  const currentPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const isAvailable = product.is_available && product.stock_quantity > 0;
  const imageSrc = product.primary_image || (product.images && product.images[0]) || '/images/logo-icon.svg';

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const orderUrl = getProductOrderUrl({
      product,
      quantity: 1,
      phoneNumber: settings.whatsapp_number || '923432833991',
      storeName: settings.store_name || 'Taj-e-Konain Gas Burner'
    });

    window.open(orderUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAvailable) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-orange-500/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image Container with Badges */}
      <Link 
        to={`/product/${product.slug}`} 
        className="relative block aspect-4/3 w-full bg-gradient-to-b from-slate-50 to-slate-100/60 p-4 overflow-hidden border-b border-slate-100"
      >
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => { e.target.src = '/images/logo-icon.svg'; }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">
              SAVE {discountPercent}%
            </span>
          )}
          {product.is_featured && !hasDiscount && (
            <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>FEATURED</span>
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isAvailable ? (
            <span className="bg-emerald-500/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-2xs backdrop-blur-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span>In Stock</span>
            </span>
          ) : (
            <span className="bg-slate-700/90 text-slate-200 text-xs font-semibold px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </span>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-2xs text-slate-500 font-medium mb-1">
            <span className="text-orange-600 font-bold uppercase tracking-wider truncate">
              {product.category_name || 'Gas Burner'}
            </span>
            <span className="font-mono text-slate-400">
              SKU: {product.sku}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Pricing and Actions */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          
          {/* Price Row */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {formatPKR(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatPKR(price)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-3 rounded-xl transition-all ${
                isAvailable
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title="Add to shopping cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
              <span>Add to Cart</span>
            </button>

            {/* Direct WhatsApp Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md transition-all active:scale-95"
              title="Order this product immediately via WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
