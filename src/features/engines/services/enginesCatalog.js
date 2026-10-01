const DEFAULT_ENGINES_API_BASE = 'https://lk.truck-import.ru/api/v1/client';

function apiBase() {
  return (process.env.ENGINES_API_BASE || process.env.LK_PRODUCTS_API_BASE || DEFAULT_ENGINES_API_BASE)
    .replace(/\/$/, '');
}

export async function getEnginesPage(query = {}) {
  const url = new URL(`${apiBase()}/engines`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Engines API returned ${response.status}`);
  return response.json();
}

export async function getEngines(query = {}) {
  const result = await getEnginesPage(query);
  return result.data;
}

export async function getEngineBySlug(slug) {
  const response = await fetch(`${apiBase()}/engines/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Engines API returned ${response.status}`);
  return response.json();
}
