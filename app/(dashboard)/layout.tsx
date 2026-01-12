import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SiteFooter } from '@/components/shared/site-footer'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#F9F9F8] flex flex-col">
            <DashboardHeader />
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    )
}
