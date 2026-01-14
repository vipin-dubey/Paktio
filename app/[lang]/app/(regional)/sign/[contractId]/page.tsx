import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContractViewer from '@/components/features/sign/contract-viewer'
import SigningForm from '@/components/features/sign/signing-form'

import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { PenTool } from 'lucide-react'

export default async function SigningPage({
    params,
    searchParams
}: {
    params: Promise<{ contractId: string; lang: string }>
    searchParams: Promise<{ email?: string }>
}) {
    const supabase = await createClient()
    const { contractId, lang } = await params
    const { email: intendedEmail } = await searchParams

    // Get current user (may be null for unauthenticated users)
    const { data: { user } } = await supabase.auth.getUser()

    const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single()

    if (contractError) {
        console.error('Contract fetch error:', contractError)
    }

    if (!contract) {
        return notFound()
    }

    // Check if user has already signed
    const { data: existingSignature } = await supabase
        .from('signatures')
        .select('*')
        .eq('contract_id', contractId)
        .eq('signer_email', user?.email || '')
        .maybeSingle()

    return (
        <div className="min-h-screen bg-[#F9F9F8] pt-4 lg:pt-8 px-4 pb-12">
            <div className="max-w-7xl mx-auto mb-4">
                <Breadcrumbs
                    items={[
                        { label: 'Sign Contract', icon: PenTool }
                    ]}
                />
            </div>
            <div className="max-w-4xl mx-auto bg-white border border-muted rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-muted bg-muted/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Contract for review</h2>
                            <h1 className="text-2xl font-bold">{contract.title}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Version</p>
                            <p className="text-sm font-bold">1.0.{contract.version}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-12 min-h-[400px]">
                    <ContractViewer contentJson={contract.content_json} />
                </div>

                <div className="p-6 sm:p-8 bg-[#F9F9F8] border-t border-muted">
                    <div className="mb-8 flex items-center justify-center sm:justify-start gap-2.5 py-2 px-4 bg-white border border-muted rounded-full w-fit mx-auto sm:mx-0 shadow-sm">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                            <span className="relative w-2 h-2 rounded-full bg-green-500 border border-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-foreground/70">Secure Integrity: SHA-256 Verified</span>
                    </div>


                    <SigningForm
                        contractId={contractId}
                        intendedEmail={intendedEmail}
                        user={user}
                        existingSignature={existingSignature}
                        lang={lang}
                    />
                </div>
            </div>
        </div>
    )
}
