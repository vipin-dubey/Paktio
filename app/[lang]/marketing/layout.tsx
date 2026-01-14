import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'

export default async function MarketingLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    return (
        <>
            <SiteHeader lang={lang} />
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter lang={lang} />
        </>
    )
}
