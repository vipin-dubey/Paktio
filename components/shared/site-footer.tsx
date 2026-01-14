import Link from 'next/link'
import { getDictionary } from '@/app/[lang]/dictionaries/get-dictionary'

export async function SiteFooter({ lang = 'en' }: { lang?: string }) {
    const dict = await getDictionary(lang)

    return (
        <footer className="py-10 text-xs text-muted-foreground flex flex-col sm:flex-row items-center sm:gap-8 gap-4 border-t border-muted/50 w-full justify-center">
            <div className="flex gap-8">
                <Link href={`/${lang}/about`} className="hover:text-primary transition-colors">{dict.footer.about}</Link>
                <Link href={`/${lang}/contact`} className="hover:text-primary transition-colors">{dict.footer.contact}</Link>
                <Link href={`/${lang}/privacy`} className="hover:text-primary transition-colors">{dict.footer.privacy}</Link>
                <Link href={`/${lang}/terms`} className="hover:text-primary transition-colors">{dict.footer.terms}</Link>
            </div>
            <span className="mt-4 sm:mt-0">© 2026 Paktio</span>
        </footer>
    )
}
