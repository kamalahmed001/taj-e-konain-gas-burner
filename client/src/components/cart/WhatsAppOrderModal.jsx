import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { getCartCheckoutUrl } from '../../services/whatsapp';
import { formatPKR, formatPhone } from '../../utils/formatters';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  PhoneCall, 
  MapPin, 
  User, 
  FileText,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export default function WhatsAppOrderModal() {
  const { cartItems, isCheckoutModalOpen, setIsCheckoutModalOpen, subtotal, clearCart } = useCart();
  const { settings } = useSettings();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Home Delivery (Pakistan Courier)');
  const [gasType, setGasType] = useState('Sui Gas (Natural Gas)');
  const [validationError, setValidationError] = useState('');
  const [hasLaunchedWhatsApp, setHasLaunchedWhatsApp] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const handleSendOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setValidationError('Your cart is empty. Please add products first.');
      return;
    }

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }

    if (!address.trim()) {
      setValidationError('Please enter your city and delivery address.');
      return;
    }

    setValidationError('');

    const combinedNotes = [
      `Gas Type Required: ${gasType}`,
      notes.trim() ? `Customer Note: ${notes.trim()}` : ''
    ].filter(Boolean).join(' | ');

    const whatsappUrl = getCartCheckoutUrl({
      items: cartItems,
      customerInfo: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        deliveryMethod,
        notes: combinedNotes
      },
      phoneNumber: settings.whatsapp_number || '923432833991',
      storeName: settings.store_name || 'Taj-e-Konain Gas Burner'
    });

    // Mark that WhatsApp has launched so customer sees next instructions
    setHasLaunchedWhatsApp(true);

    // Open WhatsApp in new window/tab (works for desktop Web & mobile app)
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setHasLaunchedWhatsApp(false);
  };

  const handleDoneAndClear = () => {
    clearCart();
    setIsCheckoutModalOpen(false);
    setHasLaunchedWhatsApp(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 z-10 border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {hasLaunchedWhatsApp ? (
          /* Step 2: Post-WhatsApp Instructions (Accurate and Transparent) */
          <div className="py-4 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                WhatsApp Order Draft Prepared!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                WhatsApp has been opened with your prefilled order message. 
                <strong className="block text-slate-900 mt-1 font-semibold">
                  Important: Please tap "Send" in WhatsApp to submit your order to Taj-e-Konain Gas Burner!
                </strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Next Steps with Our Representative:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
                <li>We will confirm product stock and package dimensions.</li>
                <li>We will quote the exact courier shipping fee to your city.</li>
                <li>Payment terms (Cash on Delivery or Bank Transfer) will be finalized.</li>
                <li>No payment has been charged yet.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleDoneAndClear}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                Clear Cart &amp; Return to Store
              </button>
              <button
                onClick={handleClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
              >
                Keep Cart &amp; Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Step 1: Customer Information and Order Confirmation */
          <form onSubmit={handleSendOrder} className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <PhoneCall className="w-4 h-4" />
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Complete WhatsApp Order
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your delivery details below. We will format a complete message and open WhatsApp directly with our store (<strong>03432833991</strong>).
              </p>
            </div>

            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Order Items Snapshot */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Selected Items ({cartItems.length}):</span>
                <span className="text-orange-600 font-extrabold text-sm">{formatPKR(subtotal)}</span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1 text-xs text-slate-600 pr-1 divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-1 flex justify-between">
                    <span className="truncate pr-2">{item.name} × {item.quantity}</span>
                    <span className="font-semibold shrink-0">
                      {formatPKR((item.discount_price || item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200 text-2xs text-slate-500">
                * Delivery charge will be calculated based on your city before finalizing.
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Tariq"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden"
                />
              </div>

              {/* Phone / Mobile */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                  <span>WhatsApp / Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden"
                />
              </div>

              {/* Delivery Address */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>City &amp; Complete Delivery Address *</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. House # 12, Street 4, Sector G-9/2, Islamabad"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-hidden resize-none"
                />
              </div>

              {/* Gas Type Selection */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Gas Type In Use
                </label>
                <select
                  value={gasType}
                  onChange={(e) => setGasType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:border-orange-500 outline-hidden"
                >
                  <option value="Sui Gas (Natural Gas)">Sui Gas (Natural Pipeline)</option>
                  <option value="LPG Cylinder">LPG Cylinder Gas</option>
                  <option value="Both / Not Sure">Both / Need Advice</option>
                </select>
              </div>

              {/* Delivery Preference */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preference</span>
                </label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:border-orange-500 outline-hidden"
                >
                  <option value="Home Delivery (Courier)">Home Delivery (Courier)</option>
                  <option value="Store Pickup">Store Pickup</option>
                  <option value="Bus / Cargo Terminal (Intercity)">Bus / Cargo Terminal</option>
                </select>
              </div>

              {/* Order Notes */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Order Notes / Instructions (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please include extra hose clamps or check nozzle size"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:border-orange-500 outline-hidden"
                />
              </div>

            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98"
              >
                <Send className="w-5 h-5" />
                <span>Confirm &amp; Send WhatsApp Order</span>
              </button>
              <p className="text-center text-xs text-slate-500 mt-2">
                Opens WhatsApp with prefilled message. No account or payment required now.
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
