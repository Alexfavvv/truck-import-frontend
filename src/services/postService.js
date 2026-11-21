function getApiBases() {
  const base = process.env.LK_PRODUCTS_API_BASE;
  return base ? [base.replace(/\/$/, '')] : [];
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
        cache: 'no-store',
        signal: AbortSignal.timeout(5000)
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
        cache: 'no-store',
        signal: AbortSignal.timeout(5000)
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
