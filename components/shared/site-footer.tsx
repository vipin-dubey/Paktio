import Link from 'next/link'

export function SiteFooter() {
    return (
        <footer className="py-10 text-xs text-muted-foreground flex flex-col sm:flex-row items-center sm:gap-8 gap-4 border-t border-muted/50 w-full justify-center">
            <div className="flex gap-8">
                <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
            <span className="mt-4 sm:mt-0">© 2026 Paktio</span>
        </footer>
    )
}
