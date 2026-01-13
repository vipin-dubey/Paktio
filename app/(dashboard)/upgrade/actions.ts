'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(priceId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // In a real app, use the Stripe SDK here

    // Mock redirect to Stripe
    return { url: 'https://checkout.stripe.com/mock' }
}

export async function getSubscriptionStatus() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('org_id, organizations(plan_type)')
        .eq('id', user.id)
        .single()

    const org = profile?.organizations as unknown as { plan_type: string } | null

    return org?.plan_type || 'free'
}
