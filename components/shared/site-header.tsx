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

                <nav className="flex items-center gap-6 text-sm font-medium">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors">
                                Settings
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
                                className="bg-foreground text-background px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all text-xs"
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
