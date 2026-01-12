import { resetPassword } from './actions'

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Enter your email to receive a reset link.
                    </p>
                </div>
                <form
                    className="mt-8 space-y-6"
                    action={async (formData) => {
                        'use server'
                        await resetPassword(formData)
                    }}
                >
                    <div>
                        <input
                            name="email"
                            type="email"
                            required
                            className="relative block w-full rounded-lg border border-muted bg-white px-3 py-3 text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    )
}
