import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DownloadCertificateButton from '@/components/features/contract/download-certificate-button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { ContractViewer } from '@/components/features/contract/contract-viewer'

export default async function HistoryPage({ params }: { params: Promise<{ contractId: string }> }) {
    const supabase = await createClient()
    const { contractId } = await params

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    const { data: contract } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single()

    const { data: signatures } = await supabase
        .from('signatures')
        .select('*')
        .eq('contract_id', contractId)
        .order('signed_at', { ascending: false })

    // Check if current user has already signed
    const userHasSigned = user && signatures?.some(sig => sig.signer_email === user.email)

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <Breadcrumbs
                items={[
                    { label: 'Contract Details' }
                ]}
            />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Contract Details</h1>
                <div className="flex items-center gap-3">
                    {!userHasSigned && contract?.status !== 'draft' && (
                        <Link
                            href="#signing-section"
                            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-3 rounded-lg text-sm font-bold hover:bg-primary/20 transition-all border border-primary/20"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Go to Signing
                        </Link>
                    )}
                    <DownloadCertificateButton
                        contract={contract}
                        signatures={signatures || []}
                        contractId={contractId}
                    />
                </div>
            </div>

            <div className="space-y-8">
                {/* Contract Metadata */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Document Information</h2>
                    <div className="bg-white rounded-lg p-6 space-y-3">
                        {/* Document Name */}
                        <div className="flex items-baseline gap-3">
                            <label className="text-xs text-muted-foreground min-w-[140px]">
                                Document Name:
                            </label>
                            <p className="text-sm font-medium">{contract?.title}</p>
                        </div>

                        {/* Creation Date */}
                        <div className="flex items-baseline gap-3">
                            <label className="text-xs text-muted-foreground min-w-[140px]">
                                Creation Date:
                            </label>
                            <p className="text-sm">{new Date(contract?.created_at || '').toLocaleDateString()}</p>
                        </div>

                        {/* Reference Number */}
                        <div className="flex items-baseline gap-3">
                            <label className="text-xs text-muted-foreground min-w-[140px]">
                                Reference Number:
                            </label>
                            <p className="text-sm font-mono">{contractId}</p>
                        </div>

                        {/* SHA-256 Hash */}
                        <div className="flex items-baseline gap-3">
                            <label className="text-xs text-muted-foreground min-w-[140px]">
                                Document Hash:
                            </label>
                            <p className="text-xs font-mono break-all text-muted-foreground">
                                {contract?.current_hash || 'Not yet calculated'}
                            </p>
                        </div>

                        {/* Access URL */}
                        <div className="flex items-baseline gap-3">
                            <label className="text-xs text-muted-foreground min-w-[140px]">
                                Access URL:
                            </label>
                            <p className="text-sm text-muted-foreground break-all">
                                {typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sign/{contractId}
                            </p>
                        </div>

                        {/* Status & Version */}
                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-muted/50">
                            <div className="text-xs text-muted-foreground">
                                Version: <span className="font-mono">v{contract?.version}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Status: {contract?.status}
                            </div>
                        </div>
                    </div>
                </section>

                <ContractViewer
                    contract={contract as any}
                    contractId={contractId}
                    userHasSigned={!!userHasSigned}
                />


                <section>
                    <h2 className="text-xl font-semibold mb-4">Signatures</h2>
                    {signatures && signatures.length > 0 ? (
                        <div className="space-y-6">
                            {signatures.map((sig, index) => (
                                <div key={sig.id} className="bg-white rounded-lg p-6">
                                    <div className="mb-6">
                                        <p className="text-xs text-muted-foreground">
                                            Signed on {new Date(sig.signed_at).toLocaleDateString()} at {new Date(sig.signed_at).toLocaleTimeString()}
                                        </p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
                                            {/* Name Row */}
                                            <div>
                                                <label className="block text-xs text-muted-foreground mb-1.5">
                                                    First Name
                                                </label>
                                                <div className="pb-1">
                                                    <p className="text-sm">{sig.first_name}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-muted-foreground mb-1.5">
                                                    Last Name
                                                </label>
                                                <div className="pb-1">
                                                    <p className="text-sm">{sig.last_name}</p>
                                                </div>
                                            </div>

                                            {/* Email & Phone */}
                                            <div>
                                                <label className="block text-xs text-muted-foreground mb-1.5">
                                                    Email Address
                                                </label>
                                                <div className="pb-1">
                                                    <p className="text-sm">{sig.signer_email}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-muted-foreground mb-1.5">
                                                    Phone Number
                                                </label>
                                                <div className="pb-1">
                                                    <p className="text-sm">{sig.phone_number}</p>
                                                </div>
                                            </div>

                                            {/* DOB & SSN (or Empty) */}
                                            <div>
                                                <label className="block text-xs text-muted-foreground mb-1.5">
                                                    Date of Birth
                                                </label>
                                                <div className="pb-1">
                                                    <p className="text-sm">
                                                        {sig.date_of_birth ? new Date(sig.date_of_birth).toLocaleDateString() : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            {sig.ssn && (
                                                <div>
                                                    <label className="block text-xs text-muted-foreground mb-1.5">
                                                        Social Security Number
                                                    </label>
                                                    <div className="pb-1">
                                                        <p className="text-sm">{sig.ssn}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Address & Postal */}
                                            <div>
                                                <label className="block text-xs text-muted-foreground mb-1.5">
                                                    Street Address
                                                </label>
                                                <div className="pb-1">
                                                    <p className="text-sm">{sig.address}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-muted-foreground mb-1.5">
                                                    Postal Code
                                                </label>
                                                <div className="pb-1">
                                                    <p className="text-sm">{sig.postal_code}</p>
                                                </div>
                                            </div>

                                            {/* City */}
                                            <div>
                                                <label className="block text-xs text-muted-foreground mb-1.5">
                                                    City
                                                </label>
                                                <div className="pb-1">
                                                    <p className="text-sm">{sig.city}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification Footer */}
                                    <div className="mt-6 flex justify-between items-center text-xs text-muted-foreground">
                                        <span>
                                            Version v{sig.version_signed}
                                        </span>
                                        {sig.email_verified && (
                                            <span>
                                                Email verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">No signatures recorded yet.</p>
                    )}
                </section>

                <div className="border-t border-muted pt-6">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        All signatures are cryptographically verified using SHA-256 hashing. Any modification to the document after signing will invalidate all signatures.
                    </p>
                </div>
            </div>
        </div>
    )
}
