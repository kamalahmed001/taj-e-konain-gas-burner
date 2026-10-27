import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { formatPKR, getImageUrl } from '../utils/formatters';
import SEOHelmet from '../components/common/SEOHelmet';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck, 
  Info,
  ArrowLeft
} from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, setIsCheckoutModalOpen } = useCart();
  const { settings } = useSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      
      {/* SEO Helmet */}
      <SEOHelmet
        title="Your Shopping Cart"
        description="Review your selected gas stoves and appliances, then proceed to WhatsApp checkout."
        canonicalUrl="/cart"
      />

      <div className="border-b border-slate-200 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your order before proceeding to WhatsApp checkout.
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 font-bold underline"
          >
            Clear Entire Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-5">
          <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Cart is Currently Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven't added any gas stoves, hobs, or safety accessories to your shopping cart yet.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-colors"
            >
              <span>Explore Stoves &amp; Burners</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
            {cartItems.map((item) => {
              const price = item.discount_price || item.price;
              const total = price * item.quantity;

              return (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={getImageUrl(item.primary_image, '/images/taj-logo.png')}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = '/images/taj-logo.png'; }}
                      />
                    </div>
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-bold text-slate-900 text-sm sm:text-base hover:text-orange-600 transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        SKU: {item.sku}
                      </div>
                      <div className="text-xs font-semibold text-orange-600 mt-1">
                        Unit: {formatPKR(price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:text-orange-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-extrabold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:text-orange-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-base font-black text-slate-900 text-right min-w-[90px]">
                      {formatPKR(total)}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary & WhatsApp Checkout Box */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <h2 className="text-lg font-black text-slate-900">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-bold text-slate-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Delivery</span>
                <span className="italic text-slate-500 font-medium">To be confirmed</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between text-lg font-black text-slate-900">
                <span>Estimated Total</span>
                <span className="text-orange-600">{formatPKR(subtotal)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-900 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Final delivery charges will be confirmed by the store via WhatsApp based on your destination city.
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-4 px-4 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all active:scale-98"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Proceed to WhatsApp Order</span>
              </button>

              <Link
                to="/shop"
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-2xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe &amp; Direct Ordering • No Prepayment Required</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
