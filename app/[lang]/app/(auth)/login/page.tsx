import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { getDictionary } from '@/app/[lang]/dictionaries/get-dictionary'

export default async function LoginPage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    // Check if user is already logged in
    const supabase = await createClient()
    const { lang } = await params
    const dict = await getDictionary(lang)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect(`/${lang}/dashboard`)
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
                        {dict.auth.signInTitle}
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        {dict.auth.signInSubtitle}
                    </p>
                </div>
                <LoginForm lang={lang} dict={dict.auth} />
            </div>
        </div>
    )
}
