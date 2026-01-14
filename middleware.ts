import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supported locales
const locales = ['en', 'no', 'se', 'da', 'fi', 'is']
const defaultLocale = 'en'

// Get locale from path or headers (simplified for now)
function getLocale(request: NextRequest) {
    // 1. Check if path starts with a locale
    const pathname = request.nextUrl.pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    if (pathnameIsMissingLocale) return defaultLocale

    // Extract locale from path
    return pathname.split('/')[1]
}

export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    let hostname = request.headers.get('host') || ''

    // Normalize hostname (remove port for localhost)
    hostname = hostname.split(':')[0]

    // Determine subdomain (marketing vs app)
    // "app.paktio.com" -> app
    // "paktio.com" -> marketing
    // Localhost: "app.localhost" -> app, "localhost" -> marketing
    let currentHost = 'marketing'
    if (hostname.startsWith('app.')) {
        currentHost = 'app'
    }

    // Get locale
    const locale = getLocale(request)

    // Prepare path for rewrite
    // If path already allows includes locale, we might need to strip it for internal routing 
    // BUT Next.js dynamic routes [lang] Expect the locale to be there.
    // So we construct: /[lang]/(group)/...

    let pathname = url.pathname

    // Handle missing locale by redirecting (unless it's a file)
    const pathnameIsMissingLocale = locales.every(
        (loc) => !pathname.startsWith(`/${loc}/`) && pathname !== `/${loc}`
    )

    // Skip if internal Next.js request or static file
    if (
        pathname.includes('.') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api')
    ) {
        return NextResponse.next()
    }

    // Redirect if missing locale
    if (pathnameIsMissingLocale) {
        return NextResponse.redirect(
            new URL(`/${defaultLocale}${pathname}`, request.url)
        )
    }

    // Now rewrite to the correct route group
    // Target: /[lang]/(app|marketing)/[rest]

    // We need to inject the route group AFTER the locale
    // Current path: /en/dashboard -> /en/(app)/dashboard

    const pathParts = pathname.split('/')
    // Intelligent Route Detection
    const appPaths = [
        'login', 'signup', 'forgot-password', 'mfa',
        'dashboard', 'editor', 'history', 'templates', 'upgrade', 'settings',
        'sign', 'reset-password', 'admin-auth'
    ]
    const rest = pathParts.slice(2).filter(Boolean).join('/')
    const isAppPath = appPaths.some(path => rest.startsWith(path))

    let targetGroup = currentHost
    if (currentHost === 'marketing' && isAppPath) {
        targetGroup = 'app'
    }

    const newPath = `/${pathParts[1]}/${targetGroup}${rest ? `/${rest}` : ''}`

    // Rewrite
    let response = NextResponse.rewrite(new URL(newPath, request.url))

    // 2. Supabase Auth & Session Refresh (Keep existing logic)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )

                    // Update the rewrite response with new cookies 
                    response = NextResponse.rewrite(new URL(newPath, request.url))

                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    await supabase.auth.getUser()

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
