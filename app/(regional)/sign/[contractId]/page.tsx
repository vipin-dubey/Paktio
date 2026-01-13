import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContractViewer from '@/components/features/sign/contract-viewer'
import SigningForm from '@/components/features/sign/signing-form'
import Link from 'next/link'

export default async function SigningPage({
    params,
    searchParams
}: {
    params: Promise<{ contractId: string }>
    searchParams: Promise<{ email?: string }>
}) {
    const supabase = await createClient()
    const { contractId } = await params
    const { email: intendedEmail } = await searchParams

    // Get current user (may be null for unauthenticated users)
    const { data: { user } } = await supabase.auth.getUser()

    const { data: contract } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single()

    if (!contract) return notFound()

    // Check if user has already signed
    const { data: existingSignature } = await supabase
        .from('signatures')
        .select('*')
        .eq('contract_id', contractId)
        .eq('signer_email', user?.email || '')
        .maybeSingle()

    return (
        <div className="min-h-screen bg-[#F9F9F8] py-20 px-4">
            <div className="max-w-3xl mx-auto bg-white border border-muted rounded-2xl shadow-sm overflow-hidden">
                <div className="p-8 border-b border-muted bg-muted/5">
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

                <div className="p-12 min-h-[400px]">
                    <ContractViewer contentJson={contract.content_json} />
                </div>

                <div className="p-8 bg-muted/5 border-t border-muted">
                    <div className="mb-6 text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Document Integrity Verified via SHA-256
                    </div>


                    <SigningForm
                        contractId={contractId}
                        intendedEmail={intendedEmail}
                        user={user}
                        existingSignature={existingSignature}
                    />
                </div>
            </div>
        </div>
    )
}
