'use client'

import { Printer } from 'lucide-react'

export function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
            <Printer className="w-4 h-4" />
            Print Document
        </button>
    )
}
