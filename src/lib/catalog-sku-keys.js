/**
 * @param {string|number} segment
 * @returns {string[]}
 */
export function catalogProductLookupKeys(segment) {
  const t = String(segment ?? '').trim();
  if (!t) return [];
  return [t];
}

/**
 * @param {string|number} segment
 * @returns {string[]}
 */
export function catalogProductSkuAliases(segment) {
  return catalogProductLookupKeys(segment).map((k) => k.toLowerCase());
}

/**
 * Один и тот же товар в slug / sku / корзине с разным префиксом бренда.
 * @param {string|number} a
 * @param {string|number} b
 */
export function catalogSegmentsReferToSameSku(a, b) {
  const setA = new Set(catalogProductSkuAliases(a));
  for (const x of catalogProductSkuAliases(b)) {
    if (setA.has(x)) return true;
  }
  return false;
}

/** Возвращает исходный SKU без удаления префиксов. */
export function canonicalCatalogSkuFromSegment(segment) {
  return String(segment ?? '').trim();
}
