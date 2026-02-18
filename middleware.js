import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getRouteAction } from '@/lib/auth/route-rules'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Set a custom header with the pathname for use in server components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Create a response to pass through
  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session (important for keeping cookies up to date)
  const { data: { user } } = await supabase.auth.getUser()

  // Build user object for route rules
  const routeUser = user
    ? { role: user.user_metadata?.role || 'customer' }
    : null

  const action = getRouteAction(pathname, routeUser)

  console.log('[Middleware]', { pathname, user: routeUser, action })

  if (action === 'skip' || action === 'allow') {
    return response
  }

  if (action?.redirect) {
    const url = request.nextUrl.clone()
    url.pathname = action.redirect
    console.log('[Middleware] Redirecting to:', action.redirect)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
