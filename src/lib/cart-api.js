import { catalogProductSkuAliases } from '@/lib/catalog-sku-keys';

/**
 * Клиентские вызовы корзины через Route Handler `/api/cart` (вместо server actions).
 */
export async function apiGetCart() {
  const res = await fetch('/api/cart', { cache: 'no-store', credentials: 'same-origin' });
  if (!res.ok) throw new Error('Не удалось загрузить корзину');
  return res.json();
}

/**
 * Сессия витрины: тот же контракт, что у ЛК `GET /api/v1/auth/status` (200, `authenticated`, при входе — `user`).
 * Без 401 на «не залогинен»: гость — `{ authenticated: false }`.
 */
export async function apiGetAuthSession() {
  const res = await fetch('/api/auth/session', { cache: 'no-store', credentials: 'same-origin' });
  if (!res.ok) throw new Error('Не удалось проверить сессию');
  return res.json();
}

/** Перед добавлением в корзину: cookie → при наличии токена `GET …/auth/status` в ЛК. */
export async function ensureAuthenticatedForCart() {
  try {
    const s = await apiGetAuthSession();
    return Boolean(s?.authenticated);
  } catch {
    return false;
  }
}

/**
 * Ключ строки корзины (`i[][0]`) для авторизованного пользователя с ЛК часто — SKU,
 * а на карточке в `productId` может быть числовой `id` из каталога. Считаем строку той же позицией,
 * если совпадает id или артикул.
 * @param {string|number} rowKey
 * @param {string|number} productId
 * @param {string|number} [productSku]
 */
export function cartRowKeyMatchesProduct(rowKey, productId, productSku) {
  const row = new Set(catalogProductSkuAliases(rowKey));
  if (row.size === 0) return false;
  for (const x of catalogProductSkuAliases(productId)) {
    if (row.has(x)) return true;
  }
  for (const x of catalogProductSkuAliases(productSku)) {
    if (row.has(x)) return true;
  }
  return false;
}

/**
 * @param {{ action: 'add' | 'remove' | 'set' | 'clear'; productId?: string | number; quantity?: number }} body
 */
export async function apiPostCart(body) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    const err = new Error(data.message || 'Ошибка корзины');
    err.status = res.status;
    err.code = data.code;
    throw err;
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: data }));
  }
  return data;
}
