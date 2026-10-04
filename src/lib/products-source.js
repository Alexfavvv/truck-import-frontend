import productsData from '@/json/products.json';
import { catalogProductLookupKeys } from '@/lib/catalog-sku-keys';

const DEFAULT_LK_PRODUCTS_API_BASE = 'https://lk.truck-import.ru/api/v1/client';

export function getProductsSource() {
  return (process.env.PRODUCTS_SOURCE || 'lk').toLowerCase();
}

export function isLkProductsSource() {
  return getProductsSource() === 'lk';
}

export function getLkProductsApiBase() {
  const base = process.env.LK_PRODUCTS_API_BASE || DEFAULT_LK_PRODUCTS_API_BASE;
  return base.replace(/\/$/, '');
}

function productRequestHeaders(accessToken) {
  const headers = { Accept: 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  return headers;
}

function makeStableIdFromSku(sku) {
  let hash = 5381;
  const input = String(sku || '');
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

/** Laravel / LK часто отдаёт сущность как `{ data: { id, sku, ... } }`. */
export function unwrapLkEntityJson(json) {
  if (json == null || typeof json !== 'object') return json;
  const d = json.data;
  if (d != null && typeof d === 'object' && !Array.isArray(d)) return d;
  return json;
}

/** Числовой id товара в ЛК (Laravel может отдавать id строкой). */
function coerceProductIdFromRaw(raw) {
  const inner = unwrapLkEntityJson(raw);
  if (!inner || typeof inner !== 'object') return null;
  const v = inner.id ?? inner.product_id ?? inner?.product?.id;
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.trunc(n);
}

export function normalizeProduct(rawInput, fallback = {}) {
  const raw = unwrapLkEntityJson(rawInput);
  const skuRaw = String(raw?.sku || '').trim();
  const sku = skuRaw;
  const brandSlug = raw?.brand_slug ?? raw?.brand?.slug ?? raw?.brand ?? '';
  const brandName = raw?.brand_name ?? raw?.brand?.name ?? raw?.brand ?? '';
  const modelSlug = raw?.model_slug ?? raw?.model?.slug ?? raw?.model ?? '';
  const modelName = raw?.model_name ?? raw?.model?.name ?? raw?.model ?? '';
  const lkNumericId = coerceProductIdFromRaw(raw);
  const lkIdFromSku = isLkProductsSource() && lkNumericId == null && Boolean(sku);
  return {
    // Для API lk в списке часто нет numeric id. Используем sku как стабильный id,
    // чтобы корзина могла повторно загрузить товар через /api/products/{idOrSku}.
    id: lkNumericId != null ? lkNumericId : (lkIdFromSku ? sku : (sku || makeStableIdFromSku(skuRaw))),
    sku,
    name: raw?.name ?? raw?.title ?? '',
    title: raw?.title ?? raw?.name ?? '',
    price: raw?.price ?? '0',
    weight: raw?.weight ?? null,
    width: raw?.width ?? null,
    height: raw?.height ?? null,
    length: raw?.length ?? null,
    replacement: raw?.replacement ?? null,
    delivery: raw?.delivery ?? null,
    count: raw?.count ?? raw?.quantity ?? 0,
    quantity: raw?.quantity ?? raw?.count ?? 0,
    image_url: raw?.image_url ?? null,
    brand: brandSlug,
    brand_name: brandName,
    model: modelSlug,
    model_name: modelName,
    category_slug: raw?.category_slug ?? fallback.part ?? 'other',
    category_id: raw?.category_id ?? null,
    specifications: Array.isArray(raw?.specifications) ? raw.specifications : [],
    characteristics: Array.isArray(raw?.characteristics) ? raw.characteristics : [],
    description: raw?.description ?? null,
    truck_manufacturers: Array.isArray(raw?.truck_manufacturers) ? raw.truck_manufacturers : [],
  };
}

export function getJsonProducts() {
  return productsData.map((p) => normalizeProduct(p));
}

export async function fetchLkProductsPage(query = {}, accessToken = '') {
  const url = new URL(`${getLkProductsApiBase()}/products`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    headers: productRequestHeaders(accessToken),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`LK products request failed: ${res.status}`);
  }

  const data = await res.json();
  const fromHeader = Number.parseInt(res.headers.get('x-total-count') || '', 10);

  // Поддерживаем оба формата: массив или пагинированный объект.
  const rawItems = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  const normalizedItems = rawItems.map((item) => normalizeProduct(item, {
    brand: query.brand,
    model: query.model,
    part: query.part,
  }));

  const fromMeta = Number.parseInt(
    String(data?.meta?.total ?? data?.total ?? ''),
    10,
  );
  const total = Number.isFinite(fromMeta)
    ? fromMeta
    : (Number.isFinite(fromHeader) ? fromHeader : normalizedItems.length);

  return { items: normalizedItems, total };
}

export async function fetchLkProducts(query = {}, accessToken = '') {
  const { items } = await fetchLkProductsPage(query, accessToken);
  return items;
}

export async function fetchLkProductsCount(query = {}) {
  const url = new URL(`${getLkProductsApiBase()}/products/count`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`LK products count request failed: ${res.status}`);
  }

  const data = await res.json();
  const total = Number.parseInt(String(data?.total ?? data?.count ?? data), 10);
  if (!Number.isFinite(total)) {
    throw new Error('LK products count response has no numeric total');
  }
  return total;
}

export async function fetchLkBrands() {
  const res = await fetch(`${getLkProductsApiBase()}/brands`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data
    .filter((b) => b?.slug)
    .map((b) => ({ value: b.slug, label: b.name || b.slug }));
}

/**
 * Реальный `product_id` для POST корзины ЛК.
 * В списке `GET …/products` у ЛК нет поля `id`; оно есть в `GET …/products/{sku}`.
 * Числовой сегмент в URL каталога не всегда резолвится (PK ≠ сегмент маршрута) — тогда
 * используем число как уже известный `product_id` из строки корзины ЛК.
 * @param {string|number} idOrSku
 * @returns {Promise<number|null>}
 */
export async function resolveLkProductIdForCartPost(idOrSku) {
  if (!isLkProductsSource()) {
    const n = Number(idOrSku);
    return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null;
  }
  const s = String(idOrSku ?? '').trim();
  if (!s) return null;

  const asNum = Number(s);
  const looksLikeIntegerId = Number.isFinite(asNum)
    && asNum > 0
    && String(Math.trunc(asNum)) === s;

  const product = await fetchProductByIdOrSku(s);
  if (product) {
    const n = Number(product.id);
    if (Number.isFinite(n) && n > 0) return Math.trunc(n);
  }

  if (looksLikeIntegerId) return Math.trunc(asNum);
  return null;
}

export async function fetchProductByIdOrSku(idOrSku, accessToken = '') {
  if (!isLkProductsSource()) {
    const local = getJsonProducts();
    const asNumber = Number(idOrSku);
    if (Number.isFinite(asNumber)) {
      const byId = local.find((p) => p.id === asNumber);
      if (byId) return byId;
    }
    return local.find((p) => String(p.sku).toLowerCase() === String(idOrSku).toLowerCase()) || null;
  }

  const base = getLkProductsApiBase();
  const s = String(idOrSku ?? '').trim();
  if (!s) return null;

  /** Карточка товара ЛК: в пути — SKU (не числовой PK). Ответ содержит `id`. */
  const fetchLkProductDetail = async (segment) => {
    const seg = String(segment ?? '').trim();
    if (!seg) return null;
    const res = await fetch(`${base}/products/${encodeURIComponent(seg)}`, {
      headers: productRequestHeaders(accessToken),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = unwrapLkEntityJson(await res.json());
    return normalizeProduct(data);
  };

  for (const key of catalogProductLookupKeys(s)) {
    const bySegment = await fetchLkProductDetail(key);
    if (bySegment) return bySegment;
  }

  for (const key of catalogProductLookupKeys(s)) {
    const matches = await fetchLkProducts({ sku: key, limit: 20, page: 1 }, accessToken);
    const aliases = new Set(
      catalogProductLookupKeys(s).map((k) => k.toLowerCase()),
    );
    const found = matches.find((p) => aliases.has(String(p.sku).toLowerCase()));
    if (!found?.sku) continue;

    const fromDetail = await fetchLkProductDetail(found.sku);
    if (fromDetail) return fromDetail;
  }

  return null;
}
