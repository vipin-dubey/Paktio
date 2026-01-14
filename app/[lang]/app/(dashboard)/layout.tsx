import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SiteFooter } from '@/components/shared/site-footer'

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    return (
        <div className="min-h-screen bg-[#F9F9F8] flex flex-col">
            <DashboardHeader lang={lang} />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            <SiteFooter lang={lang} />
        </div>
    )
}
