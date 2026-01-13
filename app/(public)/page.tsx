import Link from 'next/link'


export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center justify-center px-4">
            <div className="max-w-4xl text-center space-y-12">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] break-words">
                    Paktio <br />
                    <span className="text-primary italic block sm:inline">Sovereign Documents</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed italic">
                    High-end AI contract drafting with character-level precision and SHA-256 document integrity for the Scandinavian legal landscape.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                        href="/signup"
                        className="bg-foreground text-background px-10 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-all shadow-xl"
                    >
                        Start Free Trial
                    </Link>
                    <Link
                        href="/login"
                        className="border border-foreground px-10 py-4 rounded-xl text-lg font-bold hover:bg-foreground/5 transition-all outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Sign In
                    </Link>
                </div>

                <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-left border-t border-muted/50">
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">Integrity</p>
                        <p className="text-sm">Cryptographic proof for every agreement via SHA-256 integrity triggers.</p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">Intelligence</p>
                        <p className="text-sm">AI-native drafting using Gemini 1.5 Pro with context-aware legal schemas.</p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">Compliance</p>
                        <p className="text-sm">eIDAS AdES compliant signatures optimized for EEA and Scandinavian markets.</p>
                    </div>
                </div>
            </div>


        </div>
    )
}
