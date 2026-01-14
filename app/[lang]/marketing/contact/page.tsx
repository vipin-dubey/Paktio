import { getDictionary } from '@/app/[lang]/dictionaries/get-dictionary'

export default async function ContactPage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const dictionary = await getDictionary(lang)
    const content = dictionary.pages.contact

    return (
        <div className="max-w-4xl mx-auto py-24 px-4 font-serif leading-relaxed">
            <h1 className="text-5xl font-black mb-12 tracking-tighter uppercase">{content.title}</h1>
            <p className="text-xl text-muted-foreground italic mb-16 border-l-4 border-primary pl-8">
                {content.subtitle}
            </p>

            <section className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">{content.getInTouch}</h2>
                    <p>{content.details}</p>
                    <p className="font-bold">support@paktio.com</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">{content.hq}</h2>
                    <address className="not-italic">
                        <p className="font-bold">Paktio AS</p>
                        <p>Dronning Eufemias gate 16</p>
                        <p>0191 Oslo</p>
                        <p>Norway</p>
                    </address>
                </div>
            </section>
        </div>
    )
}
