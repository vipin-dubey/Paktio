'use client'

import { useState } from 'react'
import { resetPassword } from '@/app/(public)/(auth)/forgot-password/actions'
import Link from 'next/link'

export function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const result = await resetPassword(formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setSuccess(result.success)
            }
        } catch (e) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-green-900 mb-2">Check your email</h3>
                <p className="text-sm text-green-700 mb-6">
                    {success}
                </p>
                <div className="text-sm">
                    <Link href="/login" className="font-medium text-green-700 hover:text-green-600 hover:underline">
                        Return to sign in
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="mt-8 space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <div>
                <input
                    name="email"
                    type="email"
                    required
                    className="relative block w-full rounded-lg border border-muted bg-white px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Email address"
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                            Sending link...
                        </span>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>
            </div>

            <div className="text-center">
                <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                    Back to Sign in
                </Link>
            </div>
        </form>
    )
}
