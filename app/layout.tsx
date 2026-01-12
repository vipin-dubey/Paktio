import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import CookieBanner from '@/components/shared/cookie-banner'
import ChatSupport from '@/components/shared/chat-support'

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-geist-sans',
})

export const metadata: Metadata = {
    title: 'Paktio | High-End AI Contract Platform',
    description: 'AI-native contract platform for Scandinavian precision and document integrity.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${geist.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}>
                {children}
                <CookieBanner />
                <ChatSupport />
            </body>
        </html>
    )
}
