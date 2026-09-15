import { invalid } from './api';
export function safeImage(value) { return typeof value === 'string' && value.length <= 2048 && (/^\/(?!\/)[^\\]*$/.test(value) || /^https:\/\/[^\s]+$/.test(value)); }
export function productData(body) {
  const result = {};
  for (const field of ['title', 'category', 'categoryName', 'description']) {
    if (typeof body[field] !== 'string' || !body[field].trim() || body[field].length > (field === 'description' ? 10000 : 200)) invalid(`${field} is required and must be valid text.`);
    result[field] = body[field].trim();
  }
  if (typeof body.priceEUR !== 'number' || !Number.isFinite(body.priceEUR) || body.priceEUR <= 0 || body.priceEUR > 1000000) invalid('Enter a valid positive price.');
  result.priceEUR = Math.round(body.priceEUR * 100) / 100;
  if (body.originalPriceEUR != null && (typeof body.originalPriceEUR !== 'number' || !Number.isFinite(body.originalPriceEUR) || body.originalPriceEUR < result.priceEUR)) invalid('Original price must be at least the current price.');
  result.originalPriceEUR = body.originalPriceEUR ?? null;
  for (const field of ['primaryImage', 'secondaryImage']) { const value = body[field] || body.primaryImage; if (!safeImage(value)) invalid('Use an HTTPS image URL or a local image path.'); result[field] = value; }
  if (!Array.isArray(body.sizes) || !body.sizes.length || body.sizes.length > 30 || body.sizes.some(s => typeof s !== 'string' || !s.trim() || s.length > 30)) invalid('At least one valid size is required.');
  result.sizes = [...new Set(body.sizes.map(s => s.trim()))];
  if (body.inStock !== undefined && typeof body.inStock !== 'boolean') invalid('Stock status must be a boolean.');
  result.inStock = body.inStock ?? true;
  if (body.badge != null && (typeof body.badge !== 'string' || body.badge.length > 100)) invalid('Invalid badge.');
  result.badge = body.badge || '';
  result.badgeClass = result.badge.toLowerCase().includes('sale') ? 'badge--sale' : 'badge--new';
  return result;
}
