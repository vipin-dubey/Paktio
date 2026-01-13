import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SiteFooter } from '@/components/shared/site-footer'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen bg-[#F9F9F8] flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    )
}
