import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getContracts } from '@/lib/dal/contracts'
import TemplateGallery from '@/components/features/dashboard/template-gallery'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { BookOpen, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function TemplatesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const templates = await getContracts(true)

    return (
        <div className="h-full bg-[#F9F9F8] flex flex-col overflow-hidden">
            <main className="max-w-7xl mx-auto w-full px-4 pt-8 pb-4 flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <Breadcrumbs
                        items={[
                            { label: 'Template Library', icon: BookOpen }
                        ]}
                    />
                    <Link
                        href="/editor"
                        className="sm:hidden bg-foreground text-background p-3 rounded-2xl shadow-lg shadow-foreground/10 flex items-center justify-center transition-all active:scale-95 shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                    </Link>
                </div>

                {/* Global Header: Unified with Dashboard */}
                <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Template Library</h1>
                        <p className="text-sm text-muted-foreground italic">Curated frameworks for rapid high-fidelity drafting.</p>
                    </div>

                    <div className="bg-white border border-muted px-4 py-2 rounded-2xl shadow-sm">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            {templates.length} System Templates Available
                        </span>
                    </div>
                </div>

                {/* Persistent Section Header */}
                <div className="mb-6 flex items-center justify-between border-b border-muted pb-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Featured Frameworks</h2>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <section className="pb-12">
                        <TemplateGallery templates={templates} />
                    </section>
                </div>
            </main>
        </div>
    )
}
