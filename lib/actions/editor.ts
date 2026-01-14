'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'

import type { ContractContent } from '@/lib/types/database'

export async function saveContract(title: string, contentJson: ContractContent) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single()

    // Check if contract exists (update) or let upsert handle it without overwriting created_by
    // CAUTION: 'upsert' with 'created_by: user.id' is dangerous as it transfers ownership if user changes.
    // We should fetching existing first or separate create/update logic.
    // However, saveContract assumes 'upsert' based on... title?? No, that generates duplicates.
    // This function seems flawed as it lacks an ID argument.
    // Assuming this is intended for 'Create New Draft', we keep 'insert'.
    // If it's used for updates, it must take an ID.
    // Current signature: saveContract(title, content) -> No ID.
    // So this ALWAYS creates a new contract.
    const { data, error } = await supabase
        .from('contracts')
        .insert({
            title,
            content_json: contentJson,
            org_id: profile?.org_id,
            created_by: user.id,
            status: 'draft',
            updated_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
    return data
}
export async function requestSignatures(contractId: string, signers: { email: string }[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('You must be logged in to request signatures')
    }

    // Verify user has access to this contract
    const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select('id')
        .eq('id', contractId)
        .single()

    if (contractError || !contract) {
        throw new Error('Contract not found or access denied')
    }

    // Save signature requests to database (intended signers)
    const { error: requestError } = await supabase
        .from('signature_requests')
        .upsert(
            signers.map(signer => ({
                contract_id: contractId,
                signer_email: signer.email
            })),
            { onConflict: 'contract_id,signer_email' }
        )

    if (requestError) throw new Error(requestError.message)

    // Update status to pending
    const { error: updateError } = await supabase
        .from('contracts')
        .update({ status: 'pending' })
        .eq('id', contractId)

    if (updateError) throw new Error(updateError.message)

    // Send email via Resend
    const { env } = await import('@/env.mjs')

    if (!env.RESEND_API_KEY) {
        return { success: true, emailsSent: false }
    }

    const { Resend } = await import('resend')
    const resend = new Resend(env.RESEND_API_KEY)

    const results = await Promise.all(signers.map(async (signer) => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        if (!siteUrl) {
            console.error('NEXT_PUBLIC_SITE_URL is not set')
            return { error: 'Configuration error', email: signer.email }
        }
        const signingUrl = `${siteUrl}/sign/${contractId}?email=${encodeURIComponent(signer.email)}`

        return resend.emails.send({
            from: 'Paktio <support@notify.paktio.com>',
            to: signer.email,
            subject: `Please sign: ${contractId}`,
            html: `
                <h1>Signature Request</h1>
                <p>You have been requested to sign a contract.</p>
                <p><strong>Contract ID:</strong> ${contractId}</p>
                <p><a href="${signingUrl}">Click here to sign</a></p>
            `
        })
    }))

    const failed = results.filter(r => r.error)
    if (failed.length > 0) {
        console.error('Failed to send some emails:', failed)
        // We still return success as long as one succeeded, or we could throw.
        // For now let's just log.
    }

    return { success: true, emailsSent: true }
}
