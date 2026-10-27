/**
 * Formats a numeric value into Pakistani Rupees (PKR) representation.
 * Example: 11500 -> "Rs. 11,500"
 */
export function formatPKR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rs. 0';
  const num = Number(amount);
  return 'Rs. ' + num.toLocaleString('en-PK');
}

/**
 * Clean and format a Pakistani phone number for display.
 * Example: "923432833991" -> "0343 2833991"
 */
export function formatPhone(phone) {
  if (!phone) return '0343 2833991';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('92')) {
    clean = '0' + clean.slice(2);
  }
  if (clean.length === 11) {
    return `${clean.slice(0, 4)} ${clean.slice(4)}`;
  }
  return clean;
}

/**
 * Resolves an image path to an absolute usable URL across all hosting setups.
 * Handles:
 * - Base64 data URLs (data:image/...) -> returned as-is (persistent across restarts)
 * - External URLs (https://...) -> returned as-is
 * - Render /uploads/ -> resolved to Render backend URL
 * - Local static paths (/images/...) -> returned as-is
 * - Empty / broken -> fallback to official logo
 */
export function getImageUrl(url, fallback = '/images/taj-logo.png') {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }
  const clean = url.trim();
  if (clean.startsWith('data:') || clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('blob:')) {
    return clean;
  }
  if (clean.startsWith('/uploads/')) {
    const backend = (import.meta.env.VITE_API_URL || 'https://taj-e-konain-gas-burner.onrender.com').replace(/\/+$/, '');
    return `${backend}${clean}`;
  }
  return clean;
}
