'use client'

import { useState } from 'react'
import { updatePassword } from '@/app/(public)/(auth)/forgot-password/actions'

export function ResetPasswordForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        try {
            const result = await updatePassword(formData)
            if (result?.error) {
                setError(result.error)
                setLoading(false)
            }
            // success handles redirect in action
        } catch (e) {
            setError('An unexpected error occurred')
            setLoading(false)
        }
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
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="relative block w-full rounded-lg border border-muted bg-white px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Enter new password (min 6 chars)"
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
                            Updating password...
                        </span>
                    ) : (
                        'Update Password'
                    )}
                </button>
            </div>
        </form>
    )
}
