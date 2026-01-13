import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getContracts, getQuickInsights } from '@/lib/dal/contracts'
import TemplateGallery from '@/components/features/dashboard/template-gallery'
import ContractTabs from '@/components/features/dashboard/contract-tabs'
import { Plus } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Use DAL to fetch data
    const contracts = await getContracts(false)
    const templates = await getContracts(true)
    const insights = await getQuickInsights()

    return (
        <div className="h-full bg-[#F9F9F8] flex flex-col overflow-hidden">
            <main className="max-w-7xl mx-auto w-full px-4 pt-8 pb-4 flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Global Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Workspace</h1>
                            <p className="text-sm text-muted-foreground italic">Character-level precision at your fingertips.</p>
                        </div>
                        <Link
                            href="/editor"
                            className="sm:hidden bg-foreground text-background p-3 rounded-2xl shadow-lg shadow-foreground/10 flex items-center justify-center transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* High-Density Insights Card: Standalone Widget */}
                    <div className="flex gap-6 sm:gap-8 items-center bg-white border border-muted px-6 py-4 rounded-3xl shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 leading-none mb-2">Drafts</span>
                            <span className="text-2xl font-black tracking-tighter leading-none">{insights.drafts}</span>
                        </div>
                        <div className="w-px h-10 bg-muted"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 leading-none mb-2">Awaiting</span>
                            <span className="text-2xl font-black tracking-tighter leading-none">{insights.awaitingSignature}</span>
                        </div>
                        <div className="w-px h-10 bg-muted"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 leading-none mb-2">Signed</span>
                            <span className="text-2xl font-black tracking-tighter leading-none">{insights.signedThisWeek}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1 min-h-0">
                    <div className="md:col-span-3 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 sm:space-y-12">
                            {/* Contract List with FIXED HEIGHT: Constrained to viewport on mobile */}
                            <div className="bg-white border border-muted rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-[350px] sm:h-[420px] shadow-sm shrink-0">
                                <div className="p-4 sm:p-6 border-b border-muted bg-muted/5">
                                    <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest leading-none">Management Pipeline</h3>
                                </div>
                                <div className="flex-1 min-h-0">
                                    <ContractTabs contracts={contracts} />
                                </div>
                            </div>

                            {/* Templates Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-muted pb-2">
                                    <div>
                                        <h3 className="text-lg font-bold tracking-tight">System Templates</h3>
                                        <p className="text-[10px] text-muted-foreground italic">Standardized frameworks for rapid drafting.</p>
                                    </div>
                                    <Link href="/templates" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                                        Browse All
                                    </Link>
                                </div>
                                <TemplateGallery templates={templates} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Fixed elements or secondary info */}
                    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar hidden md:block">
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /><path d="m9 14 4 4" /></svg>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 leading-none">Document Security</p>
                            <p className="text-[11px] leading-relaxed text-muted-foreground italic">
                                Paktio seals every draft with a unique **SHA-256 hash**, ensuring that the version being signed is exactly what you approved.
                            </p>
                        </div>

                        <div className="bg-white border border-muted rounded-2xl p-6 space-y-4 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Helpful Links</h4>
                            <Link href="/help" className="text-xs font-bold hover:text-primary block transition-colors mt-2">Compliance Guide</Link>
                            <Link href="/api" className="text-xs font-bold hover:text-primary block transition-colors">API Documentation</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
