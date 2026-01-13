'use client'

import { useState } from 'react'
import { Copy, Check, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentHashProps {
    hash: string
    showBadge?: boolean
}

export function DocumentHash({ hash, showBadge = false }: DocumentHashProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(hash)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!hash) return null

    return (
        <div className="space-y-3">
            {showBadge && (
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Proven Integrity</span>
                </div>
            )}

            <div className="flex items-center gap-2 group">
                <div className="bg-muted px-3 py-2 rounded-lg flex-1 font-mono text-[10px] sm:text-xs text-muted-foreground break-all border border-muted-foreground/10">
                    {hash}
                </div>
                <button
                    onClick={handleCopy}
                    className="p-2.5 rounded-lg bg-white border border-muted hover:bg-muted/50 transition-all shadow-sm active:scale-95"
                    title="Copy SHA-256 Hash"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                </button>
            </div>
            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                This SHA-256 fingerprint is the unique mathematical signature of the document content.
                Any change to the contract text will result in a completely different hash.
            </p>
        </div>
    )
}
