import Link from 'next/link'

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted/50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="font-black tracking-tighter text-xl flex items-center gap-2">
                    Paktio
                </Link>

                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-foreground text-background px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all text-xs"
                    >
                        Start Free Trial
                    </Link>
                </nav>
            </div>
        </header>
    )
}
