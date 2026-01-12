import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 1. Routing Logic (determine response type)
    const url = request.nextUrl
    const hostname = request.headers.get('host') || 'paktio.com'
    const subdomain = hostname.includes('localhost')
        ? hostname.split('.')[0]
        : hostname.split('.')[0]

    let isRewrite = false

    if (!subdomain || subdomain === 'www' || subdomain === 'paktio') {
        response = NextResponse.rewrite(new URL(`/(marketing)${url.pathname}${url.search}`, request.url))
        isRewrite = true
    } else if (subdomain === 'app') {
        response = NextResponse.rewrite(new URL(`/(dashboard)${url.pathname}${url.search}`, request.url))
        isRewrite = true
    } else if (['no', 'se', 'dk'].includes(subdomain)) {
        response = NextResponse.rewrite(new URL(`/(regional)/${subdomain}${url.pathname}${url.search}`, request.url))
        isRewrite = true
    }

    // 2. Supabase Auth & Session Refresh
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
                    response = NextResponse.next({
                        request,
                    })
                    // If we had a rewrite, we need to re-apply it or set cookies on the new response
                    // This is the tricky part. The official docs create a NEW response here.
                    // If we need to persist the rewrite, we must create the response WITH the rewrite.

                    if (isRewrite) {
                        // Re-evaluate the rewrite since 'response' was reset to 'next'
                        if (!subdomain || subdomain === 'www' || subdomain === 'paktio') {
                            response = NextResponse.rewrite(new URL(`/(marketing)${url.pathname}${url.search}`, request.url))
                        } else if (subdomain === 'app') {
                            response = NextResponse.rewrite(new URL(`/(dashboard)${url.pathname}${url.search}`, request.url))
                        } else if (['no', 'se', 'dk'].includes(subdomain)) {
                            response = NextResponse.rewrite(new URL(`/(regional)/${subdomain}${url.pathname}${url.search}`, request.url))
                        }
                    }

                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Check user and redirect if needed (optional here, mostly for refreshing session)
    // We generally don't want to redirect in middleware unless strictly necessary to avoid loops.
    // But we MUST call getUser() to trigger the cookie refresh if needed.
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
