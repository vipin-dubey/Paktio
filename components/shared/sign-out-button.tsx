'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function SignOutButton({ lang = 'en' }: { lang?: string }) {
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push(`/${lang}`)
        router.refresh()
    }

    const labels: Record<string, string> = {
        en: 'Sign Out',
        no: 'Logg ut',
        se: 'Logga ut',
        da: 'Log ud',
        fi: 'Kirjaudu ulos',
        is: 'Skrá út'
    }

    return (
        <button
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50"
            title={labels[lang] || labels.en}
        >
            <LogOut className="w-5 h-5" />
        </button>
    )
}
