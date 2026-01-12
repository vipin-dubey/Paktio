'use server'

import { createClient } from '@/lib/supabase/server'

export async function validateAndSendOTP(contractId: string, enteredEmail: string) {
    const supabase = await createClient()

    // Check if this email is in the signature requests for this contract
    const { data: signatureRequest, error } = await supabase
        .from('signature_requests')
        .select('signer_email')
        .eq('contract_id', contractId)
        .eq('signer_email', enteredEmail)
        .maybeSingle()

    if (error) {
        throw new Error('Failed to validate signature request')
    }

    if (!signatureRequest) {
        throw new Error('This email address is not authorized to sign this contract')
    }

    // OTP will be sent to the email from signature_requests (the intended recipient)
    // This ensures even if someone manipulates the frontend, OTP goes to the right email
    const actualEmail = signatureRequest.signer_email

    // Send OTP using Supabase Auth (server-side)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const signingUrl = `/sign/${contractId}?email=${encodeURIComponent(actualEmail)}`

    const { error: otpError } = await supabase.auth.signInWithOtp({
        email: actualEmail,
        options: {
            shouldCreateUser: true,
            emailRedirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(signingUrl)}`,
        }
    })

    if (otpError) {
        throw new Error(otpError.message)
    }

    return { success: true, email: actualEmail }
}
