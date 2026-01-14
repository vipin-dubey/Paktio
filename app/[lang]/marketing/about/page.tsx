

import { getDictionary } from '@/app/[lang]/dictionaries/get-dictionary'

export default async function AboutPage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const dictionary = await getDictionary(lang)
    const content = dictionary.pages.about

    return (
        <div className="max-w-4xl mx-auto py-24 px-4 font-serif leading-relaxed">
            <h1 className="text-5xl font-black mb-12 tracking-tighter uppercase">{content.title}</h1>
            <p className="text-xl text-muted-foreground italic mb-16 border-l-4 border-primary pl-8">
                {content.subtitle}
            </p>

            <section className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">{content.mission.title}</h2>
                    <p>{content.mission.content}</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">{content.sovereignty.title}</h2>
                    <p>{content.sovereignty.content}</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">{content.roots.title}</h2>
                    <p>{content.roots.content}</p>
                </div>
            </section>
        </div>
    )
}
