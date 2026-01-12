'use client'

import { useActionState } from 'react'
import { verifyMFA } from './actions'

export default function MFAVerifyPage() {
    const [state, formAction] = useActionState(verifyMFA, null)

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
                        Two-Factor Authentication
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Enter the code from your authenticator app.
                    </p>
                </div>

                <form action={formAction} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="code" className="sr-only">Code</label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            required
                            maxLength={6}
                            className="block w-full text-center rounded-md border border-muted py-3 px-3 text-2xl tracking-widest bg-background placeholder-muted-foreground focus:ring-primary focus:border-primary"
                            placeholder="000000"
                        />
                    </div>

                    {state?.error && (
                        <div className="text-red-500 text-sm text-center">
                            {state.error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                        >
                            Verify
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
