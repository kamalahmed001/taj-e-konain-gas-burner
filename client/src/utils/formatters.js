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
