import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPKR, getImageUrl } from '../../utils/formatters';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  MessageSquare, 
  Info 
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    setIsCheckoutModalOpen 
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Your Shopping Cart ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Items or Empty */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Looks like you haven't added any gas burners or kitchen accessories yet.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm transition-colors"
                  >
                    <span>Browse Stoves &amp; Accessories</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              cartItems.map((item) => {
                const price = item.discount_price || item.price;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors shadow-2xs"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={getImageUrl(item.primary_image, '/images/taj-logo.png')}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = '/images/taj-logo.png'; }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          SKU: <span className="font-mono">{item.sku}</span>
                        </div>
                        <div className="text-sm font-extrabold text-orange-600 mt-1">
                          {formatPKR(price)}
                        </div>
                      </div>

                      {/* Controls: Quantity and Delete */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-orange-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-orange-600 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer: Subtotal and WhatsApp Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              {/* Delivery charge note */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/80 border border-blue-100 text-blue-900 text-xs">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Delivery charges will be confirmed by store on WhatsApp based on your destination city and package weight.
                </span>
              </div>

              {/* Totals */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Estimated Delivery</span>
                  <span className="italic text-slate-600 font-medium">To be confirmed</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-orange-600">{formatPKR(subtotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Proceed to WhatsApp Order</span>
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
