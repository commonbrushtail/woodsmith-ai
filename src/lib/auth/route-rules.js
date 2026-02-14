// Paths that should skip middleware entirely
const SKIP_PATTERNS = [
  /^\/_next\//,
  /^\/api\//,
  /^\/favicon\.ico$/,
  /\.\w+$/,  // static files with extensions
]

// Public routes accessible without auth
const PUBLIC_ROUTES = [
  '/',
  '/products',
  '/product',
  '/blog',
  '/about',
  '/branches',
  '/faq',
  '/highlight',
  '/manual',
]

const ADMIN_ROLES = ['admin', 'editor']

/**
 * Pure function that determines what action to take for a given route and user.
 *
 * @param {string} pathname - The request pathname
 * @param {object|null} user - The authenticated user object ({ role }) or null
 * @returns {'allow' | 'skip' | { redirect: string }}
 */
export function getRouteAction(pathname, user) {
  // Skip middleware for static assets and API routes
  if (SKIP_PATTERNS.some(pattern => pattern.test(pathname))) {
    return 'skip'
  }

  // Login page: redirect authenticated admins to dashboard
  if (pathname === '/login') {
    if (user && ADMIN_ROLES.includes(user.role)) {
      return { redirect: '/admin/dashboard' }
    }
    return 'allow'
  }

  // Admin routes: require admin/editor role
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return { redirect: '/login' }
    }
    if (!ADMIN_ROLES.includes(user.role)) {
      return { redirect: '/' }
    }
    return 'allow'
  }

  // Account routes: require any authenticated user
  // Redirect to homepage (not /login) — customers use LoginModal on the public site
  if (pathname.startsWith('/account')) {
    if (!user) {
      return { redirect: '/' }
    }
    return 'allow'
  }

  // Public routes and anything else: allow
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return 'allow'
  }

  return 'allow'
}
