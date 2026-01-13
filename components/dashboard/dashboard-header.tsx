import Link from 'next/link'
import { SignOutButton } from '@/components/shared/sign-out-button'
import { Plus, Settings, User } from 'lucide-react'

export function DashboardHeader() {
    return (
        <header className="bg-white border-b border-muted">
            <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
                <Link href="/dashboard">
                    <h1 className="text-2xl font-black tracking-tighter uppercase">Paktio</h1>
                </Link>
                <div className="flex items-center gap-2 md:gap-8">
                    <nav className="flex items-center gap-2 md:gap-6">
                        <Link
                            href="/editor"
                            className="hidden lg:flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
                        >
                            <Plus className="w-3.5 h-3.5" /> Draft New
                        </Link>
                        <Link href="/templates" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Templates
                        </Link>
                        <Link href="/upgrade" className="hidden md:block text-primary hover:underline text-sm font-medium">
                            Upgrade
                        </Link>

                        {/* Mobile: Show Icons for Templates/Upgrade or simplified menu if complex. 
                            For now, hiding labels is sufficient to fix crowding. */}
                        <Link href="/templates" className="md:hidden p-2 text-muted-foreground hover:text-foreground">
                            <span className="sr-only">Templates</span>
                            {/* Simple Document Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </Link>

                        <Link
                            href="/settings"
                            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2 pl-2 border-l border-muted">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <SignOutButton />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}
