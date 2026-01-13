import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from './sign-out-button'

export async function SiteHeader() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted/50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href={user ? "/dashboard" : "/"} className="font-black tracking-tighter text-2xl uppercase flex items-center gap-2">
                    PAKTIO
                </Link>

                <nav className="flex items-center gap-2 md:gap-6 text-sm font-medium">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                                Dashboard
                            </Link>
                            <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                                Settings
                            </Link>
                            {/* Mobile only icon for Dashboard if needed, otherwise just SignOut is sparse but functional for now. 
                                Actually, leaving just SignOut on mobile might be too little. 
                                Let's add a simple Mobile Menu or just icons later if requested.
                                For now, hiding text prevents layout break. 
                            */}
                            <Link href="/dashboard" className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-2">
                                <span className="sr-only">Dashboard</span>
                                {/* Simple Grid Icon for Dashboard on Mobile */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                            </Link>
                            <SignOutButton />
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-foreground text-background px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all text-xs whitespace-nowrap"
                            >
                                Start Free Trial
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
