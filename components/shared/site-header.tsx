import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from './sign-out-button'
import { Settings, LayoutGrid, File, User } from 'lucide-react'
import { CountrySwitcher } from './country-switcher'
import { getDictionary } from '@/app/[lang]/dictionaries/get-dictionary'

export async function SiteHeader({ lang = 'en' }: { lang?: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const dict = await getDictionary(lang)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted/50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href={user ? `/${lang}/dashboard` : `/${lang}`} className="font-black tracking-tighter text-2xl uppercase flex items-center gap-2">
                    PAKTIO
                </Link>

                <nav className="flex items-center gap-2 md:gap-6 text-sm font-medium">
                    <CountrySwitcher />
                    {user ? (
                        <>
                            <Link href={`/${lang}/dashboard`} className="hidden md:block text-muted-foreground hover:text-foreground transition-colors">
                                {dict.nav.dashboard}
                            </Link>
                            <Link href={`/${lang}/templates`} className="hidden md:block text-muted-foreground hover:text-foreground transition-colors">
                                {dict.nav.templates}
                            </Link>
                            <Link href={`/${lang}/settings`} className="hidden md:block text-muted-foreground hover:text-foreground transition-colors">
                                {dict.nav.settings}
                            </Link>

                            {/* Mobile Icons */}
                            <Link href={`/${lang}/dashboard`} className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-2">
                                <span className="sr-only">{dict.nav.dashboard}</span>
                                <LayoutGrid className="w-5 h-5" />
                            </Link>
                            <Link href={`/${lang}/templates`} className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-2">
                                <span className="sr-only">{dict.nav.templates}</span>
                                <File className="w-5 h-5" />
                            </Link>
                            <Link href={`/${lang}/settings`} className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-2">
                                <span className="sr-only">{dict.nav.settings}</span>
                                <Settings className="w-5 h-5" />
                            </Link>

                            <div className="flex items-center gap-2 pl-2 border-l border-muted">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <SignOutButton />
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href={`/${lang}/login`} className="text-muted-foreground hover:text-foreground transition-colors">
                                {dict.auth.signIn}
                            </Link>
                            <Link
                                href={`/${lang}/signup`}
                                className="bg-foreground text-background px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all text-xs whitespace-nowrap"
                            >
                                {dict.auth.signUp}
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
