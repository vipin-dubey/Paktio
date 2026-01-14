'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const lang = (formData.get('lang') as string) || 'en'

    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/auth/callback?next=/${lang}/admin-auth/reset-password`
    console.log('[Forgot Password] Sending reset to:', email, 'RedirectTo:', redirectTo)

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
    })

    console.log('[Forgot Password] Result:', { data, error })

    if (error) return { error: error.message }

    return { success: 'Password reset link sent to your email.' }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const lang = (formData.get('lang') as string) || 'en'

    const { error } = await supabase.auth.updateUser({ password })

    if (error) return { error: error.message }

    redirect(`/${lang}/dashboard?password_updated=true`)
}
