import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  LK_TOKEN_COOKIE,
  SSO_STATE_COOKIE,
  exchangeSsoCode,
  getLkApiBase,
  lkTokenCookieOptions,
  postLoginPathFromValidatedSsoState,
} from '@/lib/lk-sso';

function redirectWithError(request, code) {
  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  url.searchParams.set('auth_error', code);
  const res = NextResponse.redirect(url);
  return res;
}

/**
 * Callback с lk: проверка state, обмен code → token, httpOnly-cookie.
 * «Вернуть в корзину» после checkout — суффикс в OAuth `state` (см. `composeSsoOAuthState`).
 */
export async function GET(request) {
  const { searchParams } = request.nextUrl;
  if (searchParams.get('error')) {
    return redirectWithError(request, 'provider');
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(SSO_STATE_COOKIE)?.value;

  cookieStore.delete(SSO_STATE_COOKIE);

  if (!code) {
    return redirectWithError(request, 'missing_code');
  }
  if (!state || !expectedState || state !== expectedState) {
    return redirectWithError(request, 'state');
  }

  const afterLoginPath = postLoginPathFromValidatedSsoState(state);

  try {
    const data = await exchangeSsoCode(code);
    const dest = request.nextUrl.clone();
    if (!afterLoginPath && data.user?.role === 'manager_truck') {
      const res = NextResponse.redirect(`${getLkApiBase().replace(/\/$/, '')}/manager`);
      res.cookies.set(LK_TOKEN_COOKIE, data.token, lkTokenCookieOptions());
      return res;
    }
    if (afterLoginPath) {
      dest.pathname = afterLoginPath;
      dest.search = '';
    } else {
      dest.pathname = '/';
      dest.search = '';
    }
    const res = NextResponse.redirect(dest);
    res.cookies.set(LK_TOKEN_COOKIE, data.token, lkTokenCookieOptions());
    return res;
  } catch {
    return redirectWithError(request, 'exchange');
  }
}
