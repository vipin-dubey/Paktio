import { redirect } from 'next/navigation'
import { IS_COMING_SOON } from '@/lib/config'
import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'

export default async function RegionalLayout({
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
        <>
            <SiteHeader />
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </>
    )
}
