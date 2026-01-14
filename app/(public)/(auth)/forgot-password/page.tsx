import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
    return (
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Enter your email to receive a reset link.
                    </p>
                </div>
                <ForgotPasswordForm />
            </div>
        </div>
    )
}
