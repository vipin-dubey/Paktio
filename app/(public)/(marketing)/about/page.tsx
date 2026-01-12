

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-24 px-4 font-serif leading-relaxed">
            <h1 className="text-5xl font-black mb-12 tracking-tighter uppercase">About Paktio</h1>
            <p className="text-xl text-muted-foreground italic mb-16 border-l-4 border-primary pl-8">
                Defined by Integrity. Driven by Intelligence. Secured by Mathematics.
            </p>

            <section className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">Our Mission</h2>
                    <p>We are reimagining legal agreements for the digital age. We believe that a contract should be more than just text on a page—it should be an immutable, verifiable record of truth.</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">Sovereign Documents</h2>
                    <p>In a world of ephemeral data, Paktio stands for permanence. We build tools that respect the sanctity of the agreement, ensuring that what you sign is exactly what stays on record, forever.</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">Scandinavian Roots</h2>
                    <p>Born in Oslo, Paktio embodies the Scandinavian principles of transparency, trust, and minimalist design. We strip away the unnecessary to focus on what matters: the agreement itself.</p>
                </div>
            </section>


        </div>
    )
}
