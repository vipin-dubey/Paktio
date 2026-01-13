'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function verifyMFA(prevState: { error?: string } | null, formData: FormData) {
    const code = formData.get('code') as string

    if (!code || code.length !== 6) {
        return { error: 'Invalid code' }
    }

    const supabase = await createClient()

    // 1. Get user factors
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data, error: factorsError } = await supabase.auth.mfa.listFactors()
    if (factorsError) {
        return { error: factorsError.message }
    }

    const factors = data?.all || []
    const totpFactor = factors.find(f => f.factor_type === 'totp' && f.status === 'verified')
    if (!totpFactor) {
        return { error: 'No MFA factor found' }
    }

    // 2. Challenge
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id
    })

    if (challengeError) {
        return { error: challengeError.message }
    }

    // 3. Verify
    const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code: code,
    })

    if (verifyError) {
        return { error: verifyError.message }
    }

    // Success - redirect to dashboard
    redirect('/dashboard')
}
