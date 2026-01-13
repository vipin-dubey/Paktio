'use server'

import { createClient } from '@/lib/supabase/server'

export async function validateAndSendOTP(contractId: string, enteredEmail: string) {
    const supabase = await createClient()

    // Get current authenticated user (if any)
    const { data: { user } } = await supabase.auth.getUser()

    // Check if this email is in the signature requests for this contract
    const { data: signatureRequest } = await supabase
        .from('signature_requests')
        .select('signer_email')
        .eq('contract_id', contractId)
        .eq('signer_email', enteredEmail)
        .maybeSingle()

    // For authenticated users, also check if they are the contract owner
    let isContractOwner = false
    if (user) {
        const { data: contract } = await supabase
            .from('contracts')
            .select('user_id')
            .eq('id', contractId)
            .single()

        isContractOwner = !!(contract && contract.user_id === user.id && user.email === enteredEmail)
    }

    const isInvitedSigner = !!signatureRequest

    if (!isContractOwner && !isInvitedSigner) {
        throw new Error('This email address is not authorized to sign this contract')
    }

    // Send magic link to the validated email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const signingUrl = `/sign/${contractId}?email=${encodeURIComponent(enteredEmail)}`

    const { error: otpError } = await supabase.auth.signInWithOtp({
        email: enteredEmail,
        options: {
            shouldCreateUser: true,
            emailRedirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(signingUrl)}`,
        }
    })

    if (otpError) {
        throw new Error(otpError.message)
    }

    return { success: true, email: enteredEmail }
}
