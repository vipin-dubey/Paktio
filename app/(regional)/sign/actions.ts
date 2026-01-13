'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { ContractContent } from '@/lib/types/database'

interface SignerInfo {
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    dateOfBirth: string
    ssn?: string
    address: string
    postalCode: string
    city: string
    signatureImage?: string
}

export async function submitSignature(contractId: string, signerInfo: SignerInfo) {
    const supabase = await createClient()

    // Check if this email has already signed this contract
    const { data: existingSignature } = await supabase
        .from('signatures')
        .select('id')
        .eq('contract_id', contractId)
        .eq('signer_email', signerInfo.email)
        .maybeSingle()

    if (existingSignature) {
        // Already signed, just return success
        return { success: true, alreadySigned: true }
    }

    // Get current contract details including roles configuration
    const { data: contract } = await supabase
        .from('contracts')
        .select('version, created_by, content_json')
        .eq('id', contractId)
        .single()

    if (!contract) throw new Error('Contract not found')

    // Determine signer role
    const { data: { user } } = await supabase.auth.getUser()
    // Handle both raw DB field (content_json) and mapped DTO field (content)
    const content = contract.content_json as unknown as ContractContent
    const partyRoles = content?.party_roles || {}

    let role = partyRoles.signer_label || 'Signer'

    // logic: if logged in user is the creator, they are the owner
    if (user && user.id === contract.created_by) {
        role = partyRoles.owner_label || 'Document Owner'
    }

    const { error } = await supabase
        .from('signatures')
        .insert({
            contract_id: contractId,
            signer_email: signerInfo.email,
            first_name: signerInfo.firstName,
            last_name: signerInfo.lastName,
            phone_number: signerInfo.phoneNumber,
            date_of_birth: signerInfo.dateOfBirth,
            ssn: signerInfo.ssn || null,
            address: signerInfo.address,
            postal_code: signerInfo.postalCode,
            city: signerInfo.city,
            signature_image: signerInfo.signatureImage,
            version_signed: contract.version,
            email_verified: true,
            role: role // Save determined role
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
                .select('title, created_by')
                .eq('id', contractId)
                .single()

            const { data: allSignatures } = await supabase
                .from('signatures')
                .select('signer_email')
                .eq('contract_id', contractId)

            // Get contract owner email using service role client (to have admin access)
            let ownerEmail: string | undefined = undefined;

            if (env.SUPABASE_SERVICE_ROLE_KEY && env.NEXT_PUBLIC_SUPABASE_URL) {
                const adminClient = createSupabaseClient(
                    env.NEXT_PUBLIC_SUPABASE_URL,
                    env.SUPABASE_SERVICE_ROLE_KEY
                )
                const { data: ownerData } = await adminClient.auth.admin.getUserById(contractData?.created_by || '')
                ownerEmail = ownerData?.user?.email
            } else {
                console.warn('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not set. Owner notification skipped.')
            }

            // Collect all email addresses (owner + all signers)
            const emailAddresses = new Set<string>()
            if (ownerEmail) emailAddresses.add(ownerEmail)
            allSignatures?.forEach(sig => emailAddresses.add(sig.signer_email))

            // Send notification to all parties
            const emailPromises = Array.from(emailAddresses).map(email =>
                resend.emails.send({
                    from: 'Paktio <support@notify.paktio.com>',
                    to: email,
                    subject: `Contract Signed: ${contractData?.title || contractId}`,
                    html: `
                        <h1>Contract Signed</h1>
                        <p><strong>${signerInfo.firstName} ${signerInfo.lastName}</strong> (${signerInfo.email}) has signed the contract: <strong>${contractData?.title || contractId}</strong></p>
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
