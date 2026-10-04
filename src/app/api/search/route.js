import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchLkProductsPage } from '@/lib/products-source';
import { LK_TOKEN_COOKIE, lkBearerTokenLooksExpired } from '@/lib/lk-auth-cookie';

/**
 * GET /api/search?q=...&limit=...&page=...
 * Поиск товаров по названию (name) или артикулу (sku).
 * Параметр q — строка поиска (обязательный).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const limitParam = searchParams.get('limit');
    const pageParam = searchParams.get('page') || '1';

    if (!q || typeof q !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid query parameter: q' },
        { status: 400 }
      );
    }

    const query = q.trim();
    if (!query || query.length < 3) {
      return NextResponse.json({
        products: [],
        totalCount: 0,
      });
    }
    const limitNum = Math.max(1, parseInt(limitParam, 10) || 20);
    const pageNum = Math.max(1, parseInt(pageParam, 10) || 1);
    const rawToken = (await cookies()).get(LK_TOKEN_COOKIE)?.value?.trim() || '';
    const accessToken = rawToken && !lkBearerTokenLooksExpired(rawToken) ? rawToken : '';
    const { items: products, total: totalCount } = await fetchLkProductsPage({
      sku: query,
      limit: limitNum,
      page: pageNum,
    }, accessToken);

    return NextResponse.json({
      products,
      totalCount,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
