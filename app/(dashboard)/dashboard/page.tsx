import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getContracts } from '@/lib/dal/contracts'
import TemplateGallery from '@/components/features/dashboard/template-gallery'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Use DAL to fetch data
    const contracts = await getContracts(false)
    const templates = await getContracts(true)

    return (
        <div className="min-h-screen bg-[#F9F9F8]">
            <header className="bg-white border-b border-muted">
                <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
                    <h1 className="text-2xl font-black tracking-tighter uppercase">Paktio</h1>
                    <div className="flex items-center gap-6">
                        <Link href="/editor" className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all">
                            + New Contract
                        </Link>
                        <nav className="flex gap-4 text-sm font-medium">
                            <Link href="/upgrade" className="text-primary hover:underline">Upgrade</Link>
                            <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <h2 className="text-4xl font-bold tracking-tight mb-2">Workspace Dashboard</h2>
                    <p className="text-muted-foreground">Manage your organization's legal agreements with character-level precision.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-3 space-y-6">
                        <div className="bg-white border border-muted rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 bg-muted/5 border-b border-muted flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Contracts</span>
                                <span className="text-xs font-bold text-primary">{contracts?.length || 0} Total</span>
                            </div>

                            {contracts && contracts.length > 0 ? (
                                <ul className="divide-y divide-muted">
                                    {contracts.map((c) => (
                                        <li key={c.id} className="p-6 hover:bg-muted/5 transition-colors flex justify-between items-center">
                                            <div>
                                                <Link href={`/editor/${c.id}`} className="text-lg font-bold hover:text-primary block">{c.title}</Link>
                                                <p className="text-sm text-muted-foreground">Version {c.version} • Created {new Date(c.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.status === 'signed' ? 'bg-green-100 text-green-700' :
                                                    c.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                                <Link href={`/history/${c.id}`} className="text-xs font-bold text-primary hover:underline">Audit Log</Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-20 text-center space-y-4">
                                    <p className="text-muted-foreground italic">No agreements drafting yet.</p>
                                    <Link href="/editor" className="inline-block border border-primary text-primary px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/5">
                                        Draft your first contract
                                    </Link>
                                </div>
                            )}
                        </div>

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
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Signed this week</p>
                                    <p className="text-2xl font-bold">0</p>
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
