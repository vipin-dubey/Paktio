import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { getDictionary } from '@/app/[lang]/dictionaries/get-dictionary'

export default async function ForgotPasswordPage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return (
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
                        {dict.auth.forgotPassword}
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        {dict.auth.forgotPasswordSubtitle}
                    </p>
                </div>
                <ForgotPasswordForm lang={lang} dict={dict.auth} />
            </div>
        </div>
    )
}
