'use server'

import { createClient } from '@/lib/supabase/server'
import type { ContractDTO, ContractDetailDTO, ContractContent } from '@/lib/types/database'
import { z } from 'zod'

import { revalidatePath } from 'next/cache'

const contractContentSchema = z.object({
    title: z.string().min(1),
    blocks: z.array(z.object({
        id: z.string(),
        type: z.enum(['header', 'clause', 'list', 'footer']),
        content: z.string()
    })),
    legal_context: z.string().optional(),
    party_roles: z.object({
        owner_label: z.string().optional(),
        signer_label: z.string().optional()
    }).optional()
})

async function getCurrentUserContext() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single()

    let orgId = profile?.org_id

    // Auto-create organization if missing (Self-Correction for RLS)
    if (!orgId) {
        console.log('User has no organization. Auto-creating Personal Workspace...')
        const { data: newOrg, error: orgError } = await supabase
            .from('organizations')
            .insert({ name: 'Personal Workspace', plan_type: 'free' })
            .select('id')
            .single()

        if (newOrg) {
            orgId = newOrg.id
            // Link profile to new org
            await supabase.from('profiles').update({ org_id: orgId }).eq('id', user.id)
        } else {
            console.error('Failed to auto-create org:', orgError)
        }
    }

    return { supabase, userId: user.id, orgId }
}

export async function getContracts(isTemplate: boolean = false): Promise<ContractDTO[]> {
    const { supabase, orgId } = await getCurrentUserContext()

    console.log('getContracts context:', { orgId, isTemplate })

    let query = supabase
        .from('contracts')
        .select('id, title, status, version, is_template, created_at, org_id')
        .eq('is_template', isTemplate)
        .order('created_at', { ascending: false })

    if (isTemplate) {
        if (orgId) {
            // System (null) OR My Org
            query = query.or(`org_id.eq.${orgId},org_id.is.null`)
        } else {
            // Only System templates if no org
            query = query.is('org_id', null)
        }
    } else {
        if (!orgId) return []
        query = query.eq('org_id', orgId)
    }

    const { data, error } = await query

    if (error) {
        console.error('getContracts Error:', error)
        // Don't crash on SQL error, return empty
        return []
    }

    console.log(`getContracts(isTemplate=${isTemplate}) returned ${data?.length} items`)
    return data.map(c => ({
        id: c.id,
        title: c.title,
        status: c.status as ContractDTO['status'],
        version: c.version,
        is_template: c.is_template,
        updated_at: c.created_at,
        created_at: c.created_at
    }))
}



export async function getContract(id: string): Promise<ContractDetailDTO | null> {
    const { supabase, orgId } = await getCurrentUserContext()

    const { data, error } = await supabase
        .from('contracts')
        .select('*, signatures(*)')
        .eq('id', id)
        .eq('org_id', orgId)
        .single()

    if (error) return null

    return {
        id: data.id,
        title: data.title, // Logic can be improved if title is in content
        status: data.status as ContractDetailDTO['status'],
        version: data.version,
        is_template: data.is_template,
        updated_at: data.created_at,
        created_at: data.created_at,
        current_hash: data.current_hash,
        content: data.content_json as unknown as ContractContent,
        signatures: data.signatures || []
    }
}

export async function createContract(
    title: string,
    content: ContractContent,
    isTemplate: boolean = false
): Promise<string> {
    const { supabase, userId, orgId } = await getCurrentUserContext()

    if (!orgId) throw new Error('You must belong to an organization to create contracts.')

    const { data, error } = await supabase
        .from('contracts')
        .insert({
            org_id: orgId,
            created_by: userId,
            title,
            content_json: content,
            is_template: isTemplate,
            status: 'draft',
            current_hash: 'initial'
        })
        .select('id')
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard')
    revalidatePath(`/editor`)
    return data.id
}

export async function updateContract(
    id: string,
    content: ContractContent,
    isTemplate?: boolean
): Promise<void> {
    const { supabase, orgId } = await getCurrentUserContext()

    // Validate content
    contractContentSchema.parse(content)

    const updateData: {
        title: string
        content_json: ContractContent
        is_template?: boolean
    } = {
        title: content.title,
        content_json: content
    }

    if (isTemplate !== undefined) {
        updateData.is_template = isTemplate
    }

    const { error } = await supabase
        .from('contracts')
        .update(updateData)
        .eq('id', id)
        .eq('org_id', orgId)

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard')
    revalidatePath('/editor')
}

export async function deleteContract(id: string): Promise<void> {
    const { supabase, orgId } = await getCurrentUserContext()

    const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id)
        .eq('org_id', orgId)

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard')
}

export async function duplicateContract(templateId: string): Promise<string> {
    const { supabase, userId, orgId } = await getCurrentUserContext()

    // 1. Fetch the template
    const { data: template, error: fetchError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', templateId)
        .single()

    if (fetchError || !template) throw new Error('Template not found')

    // 2. Create new contract from template content
    const { data: newContract, error: insertError } = await supabase
        .from('contracts')
        .insert({
            org_id: orgId,
            created_by: userId,
            title: `${template.title}`,
            content_json: template.content_json,
            is_template: false,
            status: 'draft',
            current_hash: 'initial'
        })
        .select('id')
        .single()

    if (insertError) throw new Error(insertError.message)

    return newContract.id
}

export async function getQuickInsights() {
    const { supabase, orgId } = await getCurrentUserContext()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !orgId) return { awaitingSignature: 0, signedThisWeek: 0 }

    // 1. Awaiting your signature
    // Pending contracts where user is requested but hasn't signed
    const { data: requests } = await supabase
        .from('signature_requests')
        .select('contract_id, contracts!inner(status)')
        .eq('signer_email', user.email)
        .eq('contracts.status', 'pending')

    let awaitingCount = 0
    if (requests && requests.length > 0) {
        const contractIds = requests.map(r => r.contract_id)
        const { data: signed } = await supabase
            .from('signatures')
            .select('contract_id')
            .eq('signer_email', user.email)
            .in('contract_id', contractIds)

        const signedIds = new Set(signed?.map(s => s.contract_id))
        awaitingCount = contractIds.filter(id => !signedIds.has(id)).length
    }

    // 2. Signed this week (Org-wide)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { count: signedCount } = await supabase
        .from('signatures')
        .select('*, contracts!inner(org_id)', { count: 'exact', head: true })
        .eq('contracts.org_id', orgId)
        .gte('signed_at', weekAgo.toISOString())

    // 3. Drafts count (Org-wide)
    const { count: draftsCount } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .eq('status', 'draft')
        .eq('is_template', false)

    return {
        awaitingSignature: awaitingCount,
        signedThisWeek: signedCount || 0,
        drafts: draftsCount || 0
    }
}
