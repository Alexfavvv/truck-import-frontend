function getApiBases() {
  const bases = [];
  
  if (typeof window !== 'undefined' && window.location.origin) {
    bases.push(`${window.location.origin}/laravel/api/v1/client`);
    bases.push(`${window.location.origin}/api/v1/client`);
  }

  if (process.env.NEXT_PUBLIC_LARAVEL_API_URL) {
    bases.push(process.env.NEXT_PUBLIC_LARAVEL_API_URL.replace(/\/$/, ''));
  }
  if (process.env.LK_API_BASE_URL) {
    const b = process.env.LK_API_BASE_URL.replace(/\/$/, '');
    bases.push(b.endsWith('/api/v1/client') ? b : `${b}/api/v1/client`);
  }
  if (process.env.LK_PRODUCTS_API_BASE) {
    bases.push(process.env.LK_PRODUCTS_API_BASE.replace(/\/$/, ''));
  }
  
  //bases.push('https://lk.truck-import.sfinxai.ru/api/v1/client');
  bases.push('https://lk.truck-import.ru/api/v1/client');
  bases.push('https://truck-import.ru/laravel/api/v1/client');
  bases.push('http://localhost:8000/api/v1/client');
  bases.push('http://127.0.0.1:8000/api/v1/client');

  return Array.from(new Set(bases.filter(Boolean)));
}

export async function fetchPageSettings(slug) {
  const bases = getApiBases();

  for (const base of bases) {
    try {
      const res = await fetch(`${base}/pages/${encodeURIComponent(slug)}`, {
        next: { revalidate: 0 },
        cache: 'no-store'
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          return json.data;
        }
      }
    } catch (error) {
      // Continue trying next endpoint base
    }
  }

  return null;
}
