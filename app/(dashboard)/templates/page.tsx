import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getContracts } from '@/lib/dal/contracts'
import TemplateGallery from '@/components/features/dashboard/template-gallery'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { BookOpen } from 'lucide-react'

export default async function TemplatesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const templates = await getContracts(true)

    return (
        <div className="min-h-screen bg-[#F9F9F8]">
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-12 space-y-4">
                    <Breadcrumbs
                        items={[
                            { label: 'Dashboard', href: '/dashboard' },
                            { label: 'Template Library' }
                        ]}
                    />
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-muted rounded-2xl shadow-sm italic">
                            <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold tracking-tight">Template Library</h2>
                            <p className="text-muted-foreground italic font-serif">A curated collection of industry-standard legal frameworks.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <section>
                        <div className="mb-8 flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60 border-l-2 border-primary pl-4">Featured Templates</h3>
                        </div>
                        <TemplateGallery templates={templates} />
                    </section>
                </div>
            </main>
        </div>
    )
}
