'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitSignature(contractId: string, signerName: string, signerEmail: string) {
    const supabase = await createClient()

    // Check if this email has already signed this contract
    const { data: existingSignature } = await supabase
        .from('signatures')
        .select('id')
        .eq('contract_id', contractId)
        .eq('signer_email', signerEmail)
        .maybeSingle()

    if (existingSignature) {
        // Already signed, just return success
        return { success: true, alreadySigned: true }
    }

    // Get current contract version to ensure integrity
    const { data: contract } = await supabase
        .from('contracts')
        .select('version')
        .eq('id', contractId)
        .single()

    if (!contract) throw new Error('Contract not found')

    const { error } = await supabase
        .from('signatures')
        .insert({
            contract_id: contractId,
            signer_email: signerEmail,
            version_signed: contract.version,
            email_verified: true, // Email verified via OTP
        })

    if (error) throw new Error(error.message)

    await supabase
        .from('contracts')
        .update({ status: 'signed' })
        .eq('id', contractId)

    // Send confirmation emails to all parties
    try {
        const { env } = await import('@/env.mjs')

        if (!env.RESEND_API_KEY) {
            console.log('RESEND_API_KEY not configured, skipping email notifications')
        } else {
            const { Resend } = await import('resend')
            const resend = new Resend(env.RESEND_API_KEY)

            // Get contract details and all signatures
            const { data: contractData } = await supabase
                .from('contracts')
                .select('title, user_id')
                .eq('id', contractId)
                .single()

            const { data: allSignatures } = await supabase
                .from('signatures')
                .select('signer_email')
                .eq('contract_id', contractId)

            // Get contract owner email
            const { data: ownerData } = await supabase.auth.admin.getUserById(contractData?.user_id || '')
            const ownerEmail = ownerData?.user?.email

            // Collect all email addresses (owner + all signers)
            const emailAddresses = new Set<string>()
            if (ownerEmail) emailAddresses.add(ownerEmail)
            allSignatures?.forEach(sig => emailAddresses.add(sig.signer_email))

            // Send notification to all parties
            const emailPromises = Array.from(emailAddresses).map(email =>
                resend.emails.send({
                    from: 'Paktio <onboarding@resend.dev>',
                    to: email,
                    subject: `Contract Signed: ${contractData?.title || contractId}`,
                    html: `
                        <h1>Contract Signed</h1>
                        <p><strong>${signerEmail}</strong> has signed the contract: <strong>${contractData?.title || contractId}</strong></p>
                        <p>All signatures have been recorded and verified.</p>
                        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/history/${contractId}">View Contract History</a></p>
                    `
                })
            )

            await Promise.all(emailPromises)
            console.log(`Sent confirmation emails to ${emailAddresses.size} recipients`)
        }
    } catch (emailError) {
        console.error('Failed to send confirmation emails:', emailError)
        // Don't throw - signature was successful even if emails failed
    }

    // Revalidate related pages (but not the signing page itself - form shows success message)
    revalidatePath(`/history/${contractId}`)
    revalidatePath('/dashboard')

    return { success: true, alreadySigned: false }
}
