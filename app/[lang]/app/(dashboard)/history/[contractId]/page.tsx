import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DownloadCertificateButton from '@/components/features/contract/download-certificate-button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { History, Plus } from 'lucide-react'
import { ContractViewer } from '@/components/features/contract/contract-viewer'
import { getContract } from '@/lib/dal/contracts'
import { DocumentHash } from '@/components/features/contract/document-hash'
import { getDictionary } from '@/app/[lang]/dictionaries/get-dictionary'

export default async function HistoryPage({
    params
}: {
    params: Promise<{ lang: string, contractId: string }>
}) {
    const { lang, contractId } = await params
    const dictionary = await getDictionary(lang)
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    const contract = await getContract(contractId)
    if (!contract) redirect(`/${lang}/dashboard`)

    const signatures = contract.signatures

    // Check if current user has already signed
    const userHasSigned = user && signatures?.some((sig: any) => sig.signer_email === user.email)

    return (
        <div className="max-w-7xl mx-auto pt-4 lg:pt-8 px-4 pb-12 flex flex-col bg-[#F9F9F8]">
            <div className="mb-4 flex items-center justify-between gap-4">
                <Breadcrumbs
                    items={[
                        { label: dictionary.history.title, icon: History }
                    ]}
                />
                <Link
                    href="/editor"
                    className="sm:hidden bg-foreground text-background p-3 rounded-2xl shadow-lg shadow-foreground/10 flex items-center justify-center transition-all active:scale-95 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                </Link>
            </div>
            <div className="flex flex-row justify-between items-start gap-4 mb-6">
                <div className="space-y-1 min-w-0">
                    <h1 className="text-xl sm:text-3xl font-black tracking-tighter uppercase truncate">{dictionary.history.details}</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground italic truncate">{dictionary.history.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {!userHasSigned && contract?.status !== 'draft' && (
                        <Link
                            href="#signing-section"
                            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-bold hover:bg-primary/20 transition-all border border-primary/20 whitespace-nowrap"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span className="hidden sm:inline">{dictionary.history.actions.goToSigning}</span>
                            <span className="sm:hidden">{dictionary.history.actions.sign}</span>
                        </Link>
                    )}
                    <DownloadCertificateButton
                        contract={contract}
                        signatures={signatures || []}
                        contractId={contractId}
                        className="inline-flex items-center gap-2 bg-foreground text-background px-3 py-2 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-bold hover:opacity-90 transition-all whitespace-nowrap"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 flex flex-col gap-12">
                    {/* Contract Box: Standard height, internal scroll still useful for long docs, but page scrolls too */}
                    <ContractViewer
                        contract={contract}
                        contractId={contractId}
                        userHasSigned={!!userHasSigned}
                        className="h-[600px]"
                    />

                    {/* Signatures List */}
                    <section className="pb-2">
                        <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                            {dictionary.history.signatures.title}
                        </h2>
                        {signatures && signatures.length > 0 ? (
                            <div className="space-y-4">
                                {signatures.map((sig: any) => (
                                    <div key={sig.id} className="bg-white border border-muted rounded-2xl p-4 shadow-sm">
                                        <div className="mb-4 flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold">{sig.first_name} {sig.last_name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                                    {dictionary.history.signatures.signedOn} {new Date(sig.signed_at).toLocaleDateString()} • {new Date(sig.signed_at).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            {sig.email_verified && (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                                    {dictionary.history.signatures.verified}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 mb-1">{dictionary.auth.email}</label>
                                                <p className="text-xs font-medium">{sig.signer_email}</p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 mb-1">{dictionary.settings.personal.phone}</label>
                                                <p className="text-xs font-medium">{sig.phone_number}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-muted/5 border border-dashed border-muted rounded-2xl p-8 text-center">
                                <p className="text-muted-foreground italic text-sm">{dictionary.history.signatures.noSignatures}</p>
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                    <section className="bg-white border border-muted rounded-2xl p-6 shadow-sm sticky top-0">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">{dictionary.history.info.title}</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1.5">{dictionary.history.info.referenceId}</label>
                                <p className="text-[11px] font-mono break-all bg-muted/30 px-2 py-1.5 rounded-md border border-muted/50">{contractId}</p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1.5">{dictionary.history.info.mathematicalSignature}</label>
                                <DocumentHash hash={contract?.current_hash || ''} showBadge />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-muted">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{dictionary.history.info.version}</label>
                                    <p className="text-xs font-bold font-mono">v{contract?.version}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{dictionary.history.info.status}</label>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary capitalize">{dictionary.dashboard.insights[contract?.status === 'draft' ? 'drafts' : contract?.status === 'pending' ? 'awaiting' : 'signed']}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[10px] leading-relaxed text-muted-foreground italic">
                            {dictionary.history.info.integrityNotice}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
