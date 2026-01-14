import { SiteHeader } from '@/components/shared/site-header'

export default async function AuthLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    return (
        <div className="min-h-screen bg-[#F9F9F8] flex flex-col">
            <SiteHeader lang={lang} />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    )
}
