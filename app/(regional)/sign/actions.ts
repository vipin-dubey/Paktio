'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitSignature(contractId: string, signerName: string, signerEmail: string) {
    const supabase = await createClient()

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
        })

    if (error) throw new Error(error.message)

    await supabase
        .from('contracts')
        .update({ status: 'signed' })
        .eq('id', contractId)

    revalidatePath(`/sign/${contractId}`)
    return { success: true }
}
