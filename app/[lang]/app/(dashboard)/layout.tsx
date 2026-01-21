import { redirect } from 'next/navigation'
import { IS_COMING_SOON } from '@/lib/config'
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

    if (IS_COMING_SOON) {
        redirect(`/${lang}`)
    }
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
