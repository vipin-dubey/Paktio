import { getDictionary } from '@/app/[lang]/dictionaries/get-dictionary'

export default async function TermsPage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const dictionary = await getDictionary(lang)
    const content = dictionary.pages.terms

    return (
        <div className="max-w-4xl mx-auto py-24 px-4 font-serif leading-relaxed">
            <h1 className="text-5xl font-black mb-12 tracking-tighter uppercase">{content.title}</h1>

            <section className="space-y-12">
                {content.sections.map((section: { title: string; content: string }, index: number) => (
                    <div key={index} className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">{section.title}</h2>
                        <p className="whitespace-pre-wrap">{section.content}</p>
                    </div>
                ))}
            </section>
        </div>
    )
}
