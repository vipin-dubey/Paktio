'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/app/(public)/(auth)/actions'

export function LoginForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        try {
            const result = await login(formData)

            if (result?.error) {
                setError(result.error)
                setLoading(false)
            } else if (result?.success) {
                // Refresh router to ensure middleware/layout checks run against new session
                // This fixes the "needs refresh" issue on login
                router.refresh()

                // Allow a tiny delay for the refresh to start propagating or cookie to settle? 
                // Usually await router.refresh() (if it returned promise) would be ideal, 
                // but router.refresh() is void in Next 13/14 app router usually. 
                // However, the subsequent push will fetch the new page.

                if (result.redirectUrl) {
                    router.push(result.redirectUrl)
                }
            }
        } catch (e) {
            setError('An unexpected error occurred')
            setLoading(false)
        }
        // Note: We don't setLoading(false) on success to prevent UI flashing before redirect
    }

    return (
        <form action={handleSubmit} className="mt-8 space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}
            <div className="-space-y-px rounded-md shadow-sm">
                <div>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full rounded-t-lg border border-muted bg-white px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm transition-colors"
                        placeholder="Email address"
                    />
                </div>
                <div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="relative block w-full rounded-b-lg border border-muted bg-white px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm transition-colors"
                        placeholder="Password"
                    />
                </div>
            </div>


            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                            Signing in...
                        </span>
                    ) : (
                        'Sign in'
                    )}
                </button>
            </div>

            <div className="text-center">
                <Link href="/signup" className="text-sm font-medium text-primary hover:underline">
                    Don&apos;t have an account? Sign up
                </Link>
                <div className="mt-4">
                    <Link href="/forgot-password" className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline transition-colors">
                        Forgot your password?
                    </Link>
                </div>
            </div>
        </form>
    )
}
