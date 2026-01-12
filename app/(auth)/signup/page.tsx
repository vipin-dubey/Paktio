import { signup } from '../actions'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Join the future of character-level collaborative agreements.
                    </p>
                </div>
                <form
                    className="mt-8 space-y-6"
                    action={async (formData) => {
                        'use server'
                        await signup(formData)
                    }}
                >
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-t-lg border border-muted bg-white px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="relative block w-full rounded-b-lg border border-muted bg-white px-3 py-3 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                placeholder="Password (min 6 characters)"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                        >
                            Start Free Trial
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <a href="/login" className="text-sm font-medium text-primary hover:underline">
                        Already have an account? Sign in
                    </a>
                </div>
            </div>
        </div>
    )
}
