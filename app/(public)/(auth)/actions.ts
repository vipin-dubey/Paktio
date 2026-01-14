'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function login(formData: FormData) {
    const supabase = await createClient()

    const { email, password } = authSchema.parse(Object.fromEntries(formData))

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data, error } = await supabase.auth.mfa.listFactors()
        if (error) {
            // log error or ignore
        } else {
            const factors = data?.all || []
            const hasVerifiedMfa = factors.some(f => f.factor_type === 'totp' && f.status === 'verified')

            if (hasVerifiedMfa) {
                return { success: true, redirectUrl: '/auth/mfa/verify' }
            }
        }
    }

    revalidatePath('/', 'layout')
    return { success: true, redirectUrl: '/dashboard' }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const { email, password } = authSchema.parse(Object.fromEntries(formData))

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard?verified=true`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: 'Check your email to confirm your account.' }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
