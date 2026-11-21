function getApiBases() {
  const base = process.env.LK_PRODUCTS_API_BASE;
  return base ? [base.replace(/\/$/, '')] : [];
}

export async function fetchPageSettings(slug) {
  const bases = getApiBases();

  for (const base of bases) {
    try {
      const res = await fetch(`${base}/pages/${encodeURIComponent(slug)}`, {
        next: { revalidate: 0 },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000)
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
