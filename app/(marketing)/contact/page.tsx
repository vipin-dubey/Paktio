

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto py-24 px-4 font-serif leading-relaxed">
            <h1 className="text-5xl font-black mb-12 tracking-tighter uppercase">Contact Us</h1>
            <p className="text-xl text-muted-foreground italic mb-16 border-l-4 border-primary pl-8">
                We are here to help. Reach out to our team in Oslo for support, inquiries, or partnership opportunities.
            </p>

            <section className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">Get in Touch</h2>
                    <p>For general inquiries or support, please email us directly or use the chat widget if available.</p>
                    <p className="font-bold">support@paktio.com</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">Headquarters</h2>
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
