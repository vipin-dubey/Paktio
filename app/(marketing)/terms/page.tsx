

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto py-24 px-4 font-serif leading-relaxed">
            <h1 className="text-5xl font-black mb-12 tracking-tighter uppercase">Terms of Service</h1>

            <section className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">1. Agreement to Terms</h2>
                    <p>By using Paktio, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the application.</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">2. User Accounts</h2>
                    <p>You are responsible for maintaining the security of your account, including enabling Multi-Factor Authentication (MFA) where available. Paktio is not liable for unauthorized access resulting from insecure account management.</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">3. Legal Validity</h2>
                    <p>Paktio provides tools for Advanced Electronic Signatures (AdES) as per eIDAS standards. However, users are responsible for ensuring that their specific agreements do not require a Qualified Electronic Signature (QES) under local law.</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">4. The Integrity Rule</h2>
                    <p>Paktio enforces a strict document integrity policy. Modification of any document content after a signature has been applied will result in the immediate and irreversible voiding of all existing signatures for that version.</p>
                </div>
            </section>


        </div>
    )
}
