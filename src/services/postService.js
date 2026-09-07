function getApiBases() {
  const bases = [];
  
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

export async function fetchPosts(params = {}) {
  const { page = 1, search = '' } = params;
  const bases = getApiBases();

  for (const base of bases) {
    try {
      const url = new URL(`${base}/posts`);
      url.searchParams.append('page', page);
      if (search) {
        url.searchParams.append('search', search);
      }

      const res = await fetch(url.toString(), {
        next: { revalidate: 0 },
        cache: 'no-store'
      });

      if (res.ok) {
        const json = await res.json();
        const rawPosts = Array.isArray(json.data) ? json.data : [];
        const posts = rawPosts.map((p) => ({
          ...p,
          cover_image: p.cover_image || p.image_url || null,
        }));

        return {
          posts,
          meta: json.meta || { current_page: page, last_page: 1, total: posts.length }
        };
      }
    } catch (error) {
      // Continue trying next endpoint base
    }
  }

  // If API cannot be reached or fails, return empty list (never mock data)
  return {
    posts: [],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 0
    }
  };
}

export async function fetchPostBySlug(slug) {
  const bases = getApiBases();

  for (const base of bases) {
    try {
      const res = await fetch(`${base}/posts/${encodeURIComponent(slug)}`, {
        next: { revalidate: 0 },
        cache: 'no-store'
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const post = {
            ...json.data,
            cover_image: json.data.cover_image || json.data.image_url || null
          };

          const recent = (json.recent || []).map((p) => ({
            ...p,
            cover_image: p.cover_image || p.image_url || null
          }));

          return {
            post,
            recent
          };
        }
      }
    } catch (error) {
      // Continue trying next endpoint base
    }
  }

  return null;
}
