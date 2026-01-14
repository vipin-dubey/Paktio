import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export default async function ResetPasswordPage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    const supabase = await createClient()
    const { lang } = await params
    const { data: { user } } = await supabase.auth.getUser()

    // If no user (e.g. direct access without session), redirect to login
    if (!user) {
        redirect(`/${lang}/login`)
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
                        Set New Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Create a strong password for your account.
                    </p>
                </div>
                <ResetPasswordForm lang={lang} />
            </div>
        </div>
    )
}
