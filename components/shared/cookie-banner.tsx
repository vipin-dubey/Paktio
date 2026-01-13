'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('paktio_cookie_consent')
        if (!consent) {
            setIsVisible(true)
        }
    }, [])

    const acceptAll = () => {
        localStorage.setItem('paktio_cookie_consent', 'all')
        setIsVisible(false)
    }

    const acceptNecessary = () => {
        localStorage.setItem('paktio_cookie_consent', 'necessary')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-8 left-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto bg-white border border-muted shadow-2xl rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2">We value your privacy</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Paktio uses cookies to improve your experience and ensure document integrity as per EU laws.
                        By clicking &quot;Accept All&quot;, you consent to our use of cookies for analytics and personalized content.
                        View our <a href="/privacy" className="text-primary underline">Privacy Policy</a> for more details.
                    </p>
                </div>
                <div className="flex gap-4 shrink-0">
                    <button
                        onClick={acceptNecessary}
                        className="px-6 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Necessary only
                    </button>
                    <button
                        onClick={acceptAll}
                        className="px-8 py-3 bg-foreground text-background rounded-lg text-sm font-bold hover:bg-foreground/90 transition-all"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    )
}
