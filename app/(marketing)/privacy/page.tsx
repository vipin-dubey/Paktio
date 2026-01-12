

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto py-24 px-4 font-serif leading-relaxed">
            <h1 className="text-5xl font-black mb-12 tracking-tighter uppercase">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground italic mb-16 border-l-4 border-primary pl-8">
                At Paktio, document integrity and data sovereignty are at the core of everything we build. This policy outlines how we protect your information in accordance with GDPR and EEA standards.
            </p>

            <section className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">1. Data Sovereignty</h2>
                    <p>We believe your data belongs to you. Paktio serves as a custodian of your legal agreements. All data entered into the Paktio Block Schema is stored securely in the EEA.</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">2. Document Integrity</h2>
                    <p>Our "Integrity Rule" uses SHA-256 hashing to ensure that once a document is signed, its state cannot be modified without voiding the signatures. This cryptographic proof is stored alongside your document metadata.</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">3. Your Rights</h2>
                    <p>As per EU law, you have the right to access, rectify, or delete your personal data. You may request a full export of your account data at any time through the Settings page.</p>
                </div>
            </section>


        </div>
    )
}
