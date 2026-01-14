'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const countries = [
    { code: 'en', name: 'Global (English)', flag: '🌐' },
    { code: 'no', name: 'Norge', flag: '🇳🇴' },
    { code: 'se', name: 'Sverige', flag: '🇸🇪' },
    { code: 'da', name: 'Danmark', flag: '🇩🇰' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'is', name: 'Ísland', flag: '🇮🇸' },
]

export function CountrySwitcher() {
    const pathname = usePathname()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-10 h-10 flex items-center justify-center opacity-0 text-lg">
                🌐
            </div>
        )
    }

    // pathname is like /en/dashboard or /no
    // we want to replace the first segment
    const pathParts = pathname.split('/')
    const currentLang = pathParts[1] || 'en'
    const country = countries.find(c => c.code === currentLang) || countries[0]

    const handleSwitch = (newLang: string) => {
        setIsOpen(false)
        if (newLang === currentLang) return

        const newPathParts = [...pathParts]
        if (newPathParts[1] && countries.some(c => c.code === newPathParts[1])) {
            newPathParts[1] = newLang
        } else {
            newPathParts.splice(1, 0, newLang)
        }

        const newPath = newPathParts.join('/') || '/'
        router.push(newPath)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium hover:text-foreground/80 transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
            >
                <span className="text-lg">{country.flag}</span>
                <span className="hidden lg:inline">{country.name}</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close when clicking outside */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-muted rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 z-50 py-1">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-muted/30 mb-1">
                            Select Region
                        </div>
                        {countries.map((c) => (
                            <button
                                key={c.code}
                                onClick={() => handleSwitch(c.code)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-sm font-medium ${currentLang === c.code ? 'bg-primary/5 text-primary' : 'text-muted-foreground'}`}
                            >
                                <span className="text-xl">{c.flag}</span>
                                <div className="flex flex-col">
                                    <span>{c.name}</span>
                                    <span className="text-[10px] opacity-60 uppercase">{c.code}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
