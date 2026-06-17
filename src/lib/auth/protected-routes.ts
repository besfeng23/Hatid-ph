export const PROTECTED_ROUTE_PREFIXES = [
  '/rider',
  '/profile',
  '/trips',
  '/wallet',
  '/safety',
  '/account',
  '/notifications',
  '/payment-methods',
  '/driver',
  '/admin',
] as const;

const PUBLIC_FILE_EXTENSION_PATTERN = /\.(?:avif|bmp|gif|ico|jpeg|jpg|png|svg|webp|css|js|map|txt|xml|json|webmanifest|woff|woff2|ttf|otf)$/i;

export function isPublicPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    PUBLIC_FILE_EXTENSION_PATTERN.test(pathname)
  );
}

export function isProtectedPath(pathname: string): boolean {
  if (isPublicPath(pathname)) {
    return false;
  }

  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function buildSafeReturnTo(pathname: string, search = ''): string {
  if (!pathname.startsWith('/') || pathname.startsWith('//') || pathname.includes('://')) {
    return '/';
  }

  if (isPublicPath(pathname)) {
    return '/';
  }

  const safeSearch = search.startsWith('?') ? search : '';
  return `${pathname}${safeSearch}`;
}

export function buildLoginRedirectUrl(requestUrl: string | URL): URL {
  const url = new URL(requestUrl);
  const loginUrl = new URL('/login', url.origin);
  loginUrl.searchParams.set('returnTo', buildSafeReturnTo(url.pathname, url.search));
  return loginUrl;
}
