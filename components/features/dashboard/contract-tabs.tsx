'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import type { ContractDTO } from '@/lib/types/database'

interface ContractTabsProps {
    contracts: ContractDTO[]
}

export default function ContractTabs({ contracts }: ContractTabsProps) {
    const [activeTab, setActiveTab] = useState<'draft' | 'pending' | 'signed'>('draft')

    const filteredContracts = contracts.filter(c => c.status === activeTab)

    const tabs = [
        { id: 'draft', label: 'Drafts' },
        { id: 'pending', label: 'Pending' },
        { id: 'signed', label: 'Signed' }
    ] as const

    return (
        <div className="flex flex-col h-full">
            {/* Sticky Tab Switcher: Anchored to the top of the component */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm pb-3 pt-1 border-b border-muted/50 px-2 sm:px-4">
                <div className="bg-muted/30 p-1 rounded-xl flex w-full max-w-sm border border-muted/50">
                    {tabs.map((tab) => {
                        const count = contracts.filter(c => c.status === tab.id).length
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex-1 px-3 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all rounded-lg flex items-center justify-center gap-2",
                                    isActive
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground/80"
                                )}
                            >
                                {tab.label}
                                {count > 0 && (
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                                        isActive ? "bg-primary/5 text-primary" : "bg-muted/50 text-muted-foreground/60"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Scrollable Agreement List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-muted/30">
                    {filteredContracts.length > 0 ? (
                        <ul className="divide-y divide-muted/50">
                            {filteredContracts.map((c) => (
                                <li key={c.id} className="p-4 sm:p-6 hover:bg-muted/5 transition-colors group">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={c.status === 'draft' ? `/editor?id=${c.id}` : `/history/${c.id}`}
                                                className="text-base sm:text-lg font-bold hover:text-primary block transition-colors truncate"
                                            >
                                                {c.title}
                                            </Link>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                                                v{c.version} • {new Date(c.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 mt-1">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.1em] border",
                                                c.status === 'signed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    c.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-slate-50 text-slate-600 border-slate-100'
                                            )}>
                                                {c.status}
                                            </span>
                                            <Link
                                                href={`/history/${c.id}`}
                                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline hidden sm:block"
                                            >
                                                Audit Log
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-16 text-center space-y-4">
                            <p className="text-muted-foreground italic text-sm">No agreements in this category.</p>
                            {activeTab === 'draft' && (
                                <Link href="/editor" className="inline-block border border-primary text-primary px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/5">
                                    Draft your first contract
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
