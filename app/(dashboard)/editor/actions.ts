'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveContract(title: string, contentJson: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single()

    const { data, error } = await supabase
        .from('contracts')
        .upsert({
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

    // Update status to pending
    const { error: updateError } = await supabase
        .from('contracts')
        .update({ status: 'pending' })
        .eq('id', contractId)

    if (updateError) throw new Error(updateError.message)

    // In a real app, send emails here via Postmark/Resend
    console.log(`Sending signature requests for contract ${contractId} to:`, signers)

    return { success: true }
}
