import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { LK_TOKEN_COOKIE, getLkApiBase, getPublicSiteBase } from '@/lib/lk-sso';
import { fetchLkAuthStatus, parseLkAuthStatusResponse } from '@/lib/lk-client-cart';

/**
 * Есть токен на Next → в личный кабинет (origin из LK_API_BASE_URL).
 * Нет → старт SSO.
 */
export async function GET(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(LK_TOKEN_COOKIE)?.value;

  if (token) {
    try {
      const status = parseLkAuthStatusResponse(await fetchLkAuthStatus(token));
      if (status.authenticated) {
        const base = getLkApiBase().replace(/\/$/, '');
        const path = status.user?.role === 'manager_truck'
          ? '/manager'
          : status.user?.role === 'admin_truck' ? '/admin' : '/cabinet';
        return NextResponse.redirect(`${base}${path}`);
      }
    } catch {
      // При недоступности проверки входа используем штатную страницу входа ЛК.
      return NextResponse.redirect(`${getLkApiBase().replace(/\/$/, '')}/login`);
    }
  }

  const publicBase = getPublicSiteBase(request);
  const sso = new URL('/auth/sso', publicBase);
  return NextResponse.redirect(sso);
}
