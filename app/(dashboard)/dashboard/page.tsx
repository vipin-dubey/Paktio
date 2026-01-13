import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getContracts, getQuickInsights } from '@/lib/dal/contracts'
import TemplateGallery from '@/components/features/dashboard/template-gallery'
import ContractTabs from '@/components/features/dashboard/contract-tabs'

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
        <div className="min-h-screen bg-[#F9F9F8]">

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <h2 className="text-4xl font-bold tracking-tight mb-2">Workspace Dashboard</h2>
                    <p className="text-muted-foreground">Manage your organization&apos;s legal agreements with character-level precision.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-3 space-y-6">
                        <ContractTabs contracts={contracts as any} />

                        {/* Templates Section */}
                        <div className="space-y-4 pt-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold tracking-tight">System Templates</h3>
                                <Link href="/editor" className="text-sm text-primary hover:underline">
                                    Create Custom Template
                                </Link>
                            </div>
                            <TemplateGallery templates={templates} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-muted rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Quick Insights</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Awaiting your signature</p>
                                    <p className="text-2xl font-bold">{insights.awaitingSignature}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Signed this week</p>
                                    <p className="text-2xl font-bold">{insights.signedThisWeek}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                            <p className="text-sm font-bold text-primary mb-2">Legal Compliance Tip</p>
                            <p className="text-xs text-muted-foreground">Always ensure the SHA-256 hash matches the original draft before performing AdES validation.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
