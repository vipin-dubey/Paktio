'use client'

import { useState } from 'react'
import { signup } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function SignupForm({
    lang = 'en',
    dict
}: {
    lang?: string,
    dict: {
        email: string
        password: string
        passwordHint?: string
        signUp: string
        loadingSignUp: string
        alreadyHaveAccount: string
        signIn: string
        checkEmail: string
        returnToSignIn: string
        [key: string]: any
    }
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const result = await signup(formData)

            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setSuccess(result.success)
            }
        } catch (e) {
            setError(dict.common?.error || 'An unexpected error occurred')
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
                <h3 className="text-lg font-medium text-green-900 mb-2">{dict.checkEmail}</h3>
                <p className="text-sm text-green-700 mb-6">
                    {success}
                </p>
                <div className="text-sm">
                    <Link href={`/${lang}/login`} className="font-medium text-green-700 hover:text-green-600 hover:underline">
                        {dict.returnToSignIn}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="mt-8 space-y-6">
            <input type="hidden" name="lang" value={lang} />
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600">
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
                        placeholder={dict.email}
                    />
                </div>
                <div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="relative block w-full rounded-b-lg border border-muted bg-white px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm transition-colors"
                        placeholder={dict.passwordHint || dict.password}
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
                            {dict.loadingSignUp}
                        </span>
                    ) : (
                        dict.signUp
                    )}
                </button>
            </div>
        </form>
    )
}
