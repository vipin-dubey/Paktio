'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Contract {
    id: string
    title: string
    status: string
    version: number
    created_at: string
}

interface ContractTabsProps {
    contracts: Contract[]
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
        <div className="bg-white border border-muted rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-muted/5 border-b border-muted">
                <div className="flex px-4">
                    {tabs.map((tab) => {
                        const count = contracts.filter(c => c.status === tab.id).length
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                                    activeTab === tab.id
                                        ? "text-primary bg-white border-x border-muted border-t-2 border-t-primary -mb-[1px]"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab.label}
                                <span className={cn(
                                    "ml-2 px-1.5 py-0.5 rounded-full text-[10px]",
                                    activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                )}>
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {filteredContracts.length > 0 ? (
                <ul className="divide-y divide-muted">
                    {filteredContracts.map((c) => (
                        <li key={c.id} className="p-6 hover:bg-muted/5 transition-colors flex justify-between items-center group">
                            <div>
                                <Link
                                    href={c.status === 'draft' ? `/editor?id=${c.id}` : `/history/${c.id}`}
                                    className="text-lg font-bold hover:text-primary block transition-colors"
                                >
                                    {c.title}
                                </Link>
                                <p className="text-sm text-muted-foreground">Version {c.version} • Created {new Date(c.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    c.status === 'signed' ? 'bg-green-100 text-green-700' :
                                        c.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-gray-100 text-gray-700'
                                )}>
                                    {c.status}
                                </span>
                                <Link
                                    href={`/history/${c.id}`}
                                    className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                                >
                                    Audit Log
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-20 text-center space-y-4">
                    <p className="text-muted-foreground italic">No agreements in this category.</p>
                    {activeTab === 'draft' && (
                        <Link href="/editor" className="inline-block border border-primary text-primary px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/5">
                            Draft your first contract
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}
