import Link from 'next/link'
import { SignOutButton } from '@/components/shared/sign-out-button'
import { Settings, User } from 'lucide-react'

export function DashboardHeader() {
    return (
        <header className="bg-white border-b border-muted">
            <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
                <Link href="/dashboard">
                    <h1 className="text-2xl font-black tracking-tighter uppercase">Paktio</h1>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/editor" className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all">
                        + New Contract
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href="/upgrade" className="text-primary hover:underline text-sm font-medium">
                            Upgrade
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
