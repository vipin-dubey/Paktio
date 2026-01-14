'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import type { ContractBlock, ContractDetailDTO } from '@/lib/types/database'

interface ContractViewerProps {
    contract: ContractDetailDTO
    contractId: string
    userHasSigned: boolean
    className?: string
}

export function ContractViewer({ contract, contractId, userHasSigned, className }: ContractViewerProps) {
    const [hasReadToBottom, setHasReadToBottom] = useState(false)
    const [isAccepted, setIsAccepted] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        if (!scrollRef.current || hasReadToBottom) return

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
        // Check if user is within 20px of bottom
        if (scrollHeight - scrollTop - clientHeight < 20) {
            setHasReadToBottom(true)
        }
    }

    // Auto-enable if content is shorter than container
    useEffect(() => {
        if (scrollRef.current) {
            const { scrollHeight, clientHeight } = scrollRef.current
            if (scrollHeight <= clientHeight) {
                setHasReadToBottom(true)
            }
        }
    }, [])

    return (
        <div className="space-y-8 flex flex-col h-full">
            {/* Document Content View */}
            <section className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-end mb-4 shrink-0">
                    <h2 className="text-xl font-semibold">Document Content</h2>
                    <Link
                        href={`/view/${contractId}`}
                        target="_blank"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Full Document
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col border border-muted flex-1 min-h-0">
                    <div className="px-8 py-6 border-b bg-muted/5 shrink-0">
                        <h1 className="text-2xl font-bold text-center">
                            {contract?.title}
                        </h1>
                    </div>

                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className={cn("p-8 overflow-y-auto space-y-4 scroll-smooth flex-1", className || "h-[500px]")}
                    >
                        {(contract?.content?.blocks || []).map((block: ContractBlock) => (
                            <div key={block.id} className="text-foreground">
                                {block.type === 'header' && (
                                    <h3 className="text-lg font-bold mt-6 mb-2">{block.content}</h3>
                                )}
                                {block.type === 'clause' && (
                                    <p className="text-sm leading-relaxed mb-4">{block.content}</p>
                                )}
                                {block.type === 'list' && (
                                    <div className="flex gap-3 mb-2 ml-4">
                                        <span className="text-primary font-bold">•</span>
                                        <p className="text-sm leading-relaxed">{block.content}</p>
                                    </div>
                                )}
                                {block.type === 'footer' && (
                                    <p className="text-xs text-muted-foreground mt-8 border-t pt-4 italic">
                                        {block.content}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {!hasReadToBottom && (
                        <div className="px-8 py-3 bg-amber-50 border-t border-amber-100 flex items-center justify-center gap-2 text-xs text-amber-700 animate-pulse">
                            <span>↓ Please scroll to the bottom of the document to proceed</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Acceptance & Sign Section */}
            {!userHasSigned && contract?.status !== 'draft' && (
                <section id="signing-section" className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-6 scroll-mt-20">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                type="checkbox"
                                disabled={!hasReadToBottom}
                                checked={isAccepted}
                                onChange={(e) => setIsAccepted(e.target.checked)}
                                className="w-4 h-4 rounded border-muted text-primary focus:ring-primary disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="text-sm">
                            <label
                                htmlFor="terms"
                                className={cn(
                                    "font-medium transition-colors cursor-pointer",
                                    !hasReadToBottom ? "text-muted-foreground cursor-not-allowed" : "text-foreground"
                                )}
                            >
                                I have read and understood the terms and conditions outlined in this document.
                            </label>
                            <p className="text-muted-foreground text-xs mt-1">
                                By checking this box, you acknowledge that you have reviewed the entire agreement.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                        <div>
                            <h3 className="font-bold text-primary mb-1">Your signature is required</h3>
                            <p className="text-sm text-muted-foreground">Sign this contract to complete the agreement</p>
                        </div>
                        <Link
                            href={`/sign/${contractId}`}
                            className={cn(
                                "bg-foreground text-background px-8 py-3 rounded-lg text-sm font-bold transition-all inline-block",
                                (!isAccepted || !hasReadToBottom)
                                    ? "opacity-30 cursor-not-allowed pointer-events-none grayscale"
                                    : "hover:opacity-90 hover:scale-[1.02] shadow-lg shadow-primary/10"
                            )}
                        >
                            Sign this contract
                        </Link>
                    </div>
                </section>
            )}
        </div>
    )
}
