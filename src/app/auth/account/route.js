import { NextResponse } from 'next/server';
import { getPublicSiteBase } from '@/lib/lk-sso';

/**
 * Всегда запускаем SSO, чтобы LK определял пользователя по актуальной web-session,
 * а не по потенциально устаревшей cookie витрины.
 */
export async function GET(request) {
  const publicBase = getPublicSiteBase(request);
  const sso = new URL('/auth/sso', publicBase);
  return NextResponse.redirect(sso);
}
