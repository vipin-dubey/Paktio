import Link from 'next/link'
import { getDictionary } from '../dictionaries/get-dictionary'

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return (
        <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center justify-center px-4 pt-24 pb-12 sm:pt-0 sm:pb-0">
            <div className="max-w-4xl text-center space-y-12">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] break-words">
                    {dict.marketing.hero.title} <br />
                    <span className="text-primary italic block sm:inline">{dict.marketing.hero.subtitle}</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed italic">
                    {dict.marketing.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                        href={`/${lang}/signup`}
                        className="bg-foreground text-background px-10 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-all shadow-xl"
                    >
                        {dict.marketing.hero.ctaStart}
                    </Link>
                    <Link
                        href={`/${lang}/login`}
                        className="border border-foreground px-10 py-4 rounded-xl text-lg font-bold hover:bg-foreground/5 transition-all outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        {dict.marketing.hero.ctaSignIn}
                    </Link>
                </div>

                <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-left border-t border-muted/50">
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">{dict.marketing.features.integrity.label}</p>
                        <p className="text-sm">{dict.marketing.features.integrity.text}</p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">{dict.marketing.features.intelligence.label}</p>
                        <p className="text-sm">{dict.marketing.features.intelligence.text}</p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">{dict.marketing.features.compliance.label}</p>
                        <p className="text-sm">{dict.marketing.features.compliance.text}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
