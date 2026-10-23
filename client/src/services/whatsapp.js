import { formatPKR } from '../utils/formatters.js';

const DEFAULT_WHATSAPP_NUMBER = '923432833991';

/**
 * Normalizes phone number to international WhatsApp format (e.g. 923432833991)
 */
export function normalizeWhatsAppNumber(number) {
  if (!number) return DEFAULT_WHATSAPP_NUMBER;
  let clean = String(number).replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '92' + clean.slice(1);
  }
  if (!clean.startsWith('92')) {
    clean = '92' + clean;
  }
  return clean;
}

/**
 * Builds standard WhatsApp URL
 */
export function buildWhatsAppUrl(message, phoneNumber = DEFAULT_WHATSAPP_NUMBER) {
  const normalized = normalizeWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encodedText}`;
}

/**
 * Generates single product order message and URL
 */
export function getProductOrderUrl({
  product,
  quantity = 1,
  phoneNumber = DEFAULT_WHATSAPP_NUMBER,
  storeName = 'Taj-e-Konain Gas Burner'
}) {
  const price = product.discount_price || product.price;
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';

  const message = `Assalam-o-Alaikum, ${storeName}!

I would like to order the following product:

Product: ${product.name}
SKU / ID: ${product.sku || product.id}
Unit Price: ${formatPKR(price)}
Quantity: ${quantity}
Estimated Total: ${formatPKR(price * quantity)}
${productUrl ? `Product Link: ${productUrl}\n` : ''}
Please confirm product availability, delivery charges to my location, and order details.

Thank you!`;

  return buildWhatsAppUrl(message, phoneNumber);
}

/**
 * Generates full multi-item cart checkout message and URL
 */
export function getCartCheckoutUrl({
  items = [],
  customerInfo = {},
  phoneNumber = DEFAULT_WHATSAPP_NUMBER,
  storeName = 'Taj-e-Konain Gas Burner'
}) {
  const {
    name = '',
    phone = '',
    address = '',
    notes = '',
    deliveryMethod = 'Delivery'
  } = customerInfo;

  let itemsList = items
    .map(item => {
      const unitPrice = item.discount_price || item.price;
      const itemTotal = unitPrice * item.quantity;
      return `- ${item.name} (SKU: ${item.sku}) × ${item.quantity} — ${formatPKR(unitPrice)} (Subtotal: ${formatPKR(itemTotal)})`;
    })
    .join('\n');

  const subtotal = items.reduce((sum, item) => {
    const price = item.discount_price || item.price;
    return sum + price * item.quantity;
  }, 0);

  const message = `Assalam-o-Alaikum, ${storeName}!

I would like to place an order from your website.

Order Items:
${itemsList}

Subtotal: ${formatPKR(subtotal)}
Delivery Fee: To be confirmed by store
Estimated Total: ${formatPKR(subtotal)} (excl. unconfirmed delivery charges)

Customer Details:
- Name: ${name || 'Not provided'}
- Contact Number: ${phone || 'Same as WhatsApp'}
- Delivery Address / City: ${address || 'To be specified'}
- Preference: ${deliveryMethod}
${notes ? `- Order Notes / Questions: ${notes}\n` : ''}
Please confirm product stock availability, courier delivery charges to my address, and order confirmation.

Thank you!`;

  return buildWhatsAppUrl(message, phoneNumber);
}

/**
 * Quick inquiry message for a general query
 */
export function getGeneralInquiryUrl({
  subject = 'Inquiry',
  phoneNumber = DEFAULT_WHATSAPP_NUMBER,
  storeName = 'Taj-e-Konain Gas Burner'
}) {
  const message = `Assalam-o-Alaikum, ${storeName}!

I have an inquiry regarding your gas stoves and kitchen appliances: ${subject}.

Could you please assist me with details and catalog pricing?

Thank you!`;

  return buildWhatsAppUrl(message, phoneNumber);
}
