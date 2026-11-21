import { randomBytes } from 'crypto';

export { LK_TOKEN_COOKIE, lkBearerTokenLooksExpired } from './lk-auth-cookie.js';

/** Временная cookie для проверки state при возврате с SSO. */
export const SSO_STATE_COOKIE = 'ti_sso_state';

/**
 * Суффикс к OAuth `state` (и к значению в cookie): после логина — `/cart`.
 * Идёт в URL callback с LK, не зависит от домена cookie (www / apex).
 */
const SSO_STATE_SUFFIX_CART = '_ti_cart';

/**
 * @param {string} nonce — случайная часть (`createSsoState`)
 * @param {string | null} postLoginPath — только `null` или `/cart`
 * @returns {string}
 */
export function composeSsoOAuthState(nonce, postLoginPath) {
  if (postLoginPath === '/cart') return `${nonce}${SSO_STATE_SUFFIX_CART}`;
  return nonce;
}

/**
 * Куда редиректить после успешного SSO, если `state` уже сверен с cookie.
 * @param {string} validatedState — значение `state` из callback URL
 * @returns {string | null}
 */
export function postLoginPathFromValidatedSsoState(validatedState) {
  if (typeof validatedState !== 'string' || !validatedState.endsWith(SSO_STATE_SUFFIX_CART)) {
    return null;
  }
  const nonce = validatedState.slice(0, -SSO_STATE_SUFFIX_CART.length);
  if (nonce.length !== 64 || !/^[0-9a-f]+$/.test(nonce)) return null;
  return '/cart';
}

export function getLkApiBase() {
  const base = process.env.LK_API_BASE_URL || 'https://lk.truck-import.ru';
  return base.replace(/\/$/, '');
}

/**
 * Публичный origin запроса (учёт reverse-proxy: x-forwarded-host / x-forwarded-proto).
 * Нужен для внутренних редиректов, когда `request.url` указывает на внутренний хост.
 * @param {Request} request
 * @returns {string}
 */
export function getRequestOrigin(request) {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (forwardedHost) {
    const host = forwardedHost.split(',')[0].trim();
    const proto = (forwardedProto || 'https').split(',')[0].trim();
    return `${proto}://${host}`.replace(/\/$/, '');
  }
  try {
    return new URL(request.url).origin.replace(/\/$/, '');
  } catch {
    return '';
  }
}

/**
 * Публичный origin витрины для SSO `redirect_uri` и редиректов.
 * Сначала хост из запроса (Vercel: x-forwarded-host), иначе SITE_URL — чтобы env с localhost
 * не ломал прод при деплое с .env.local.
 * @param {Request} request
 */
export function getPublicSiteBase(request) {
  const fromRequest = getRequestOrigin(request);
  if (fromRequest) return fromRequest;
  const fromEnv = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  return fromEnv ? fromEnv.replace(/\/$/, '') : '';
}

export function createSsoState() {
  return randomBytes(32).toString('hex');
}

export function buildSsoAuthorizeUrl(redirectUri, state) {
  const base = getLkApiBase();
  const url = new URL('/sso/authorize', 'https://bigauto24.ru');
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  return url.toString();
}

function cookieBaseOptions() {
  const secure = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
  };
}

export function ssoStateCookieOptions() {
  return {
    ...cookieBaseOptions(),
    maxAge: 600,
  };
}

export function lkTokenCookieOptions() {
  const maxAgeRaw = process.env.LK_AUTH_COOKIE_MAX_AGE;
  const maxAge = maxAgeRaw ? Number.parseInt(maxAgeRaw, 10) : 60 * 60 * 24 * 30;
  return {
    ...cookieBaseOptions(),
    maxAge: Number.isFinite(maxAge) && maxAge > 0 ? maxAge : 60 * 60 * 24 * 30,
  };
}

/** Снять SSO-cookie витрины (надёжнее, чем только `delete`, если cookie ставилась с теми же опциями). */
export function applyClearLkAuthCookies(res) {
  res.cookies.set(LK_TOKEN_COOKIE, '', { ...lkTokenCookieOptions(), maxAge: 0 });
  res.cookies.set(SSO_STATE_COOKIE, '', { ...ssoStateCookieOptions(), maxAge: 0 });
}

/** Разрешённый путь после SSO из cookie (защита от open redirect). */
export function normalizeSsoPostLoginPath(raw) {
  if (typeof raw !== 'string') return null;
  const p = raw.trim().replace(/\/+$/, '') || '/';
  if (p === '/cart') return '/cart';
  return null;
}

/**
 * @param {string} code
 * @returns {Promise<{ token: string, token_type?: string, user?: unknown }>}
 */
export async function exchangeSsoCode(code) {
  const res = await fetch(`${getLkApiBase()}/api/v1/auth/sso/exchange`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
    cache: 'no-store',
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    const err = new Error(data.message || `SSO exchange failed: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  if (!data.token || typeof data.token !== 'string') {
    const err = new Error('SSO exchange: missing token in response');
    err.status = 502;
    throw err;
  }

  return data;
}
