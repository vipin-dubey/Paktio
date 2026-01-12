'use client'

import { useState } from 'react'
import { generateContract } from '@/app/actions/gemini'
import { createContract } from '@/lib/dal/contracts'
import type { ContractBlock } from '@/lib/types/database'

interface Block extends ContractBlock { }

interface ContractEditorProps {
    initialData?: {
        title: string
        blocks: Block[]
        id?: string
    }
}

export default function ContractEditor({ initialData }: ContractEditorProps) {
    const [prompt, setPrompt] = useState('')
    const [title, setTitle] = useState(initialData?.title || 'Untitled Contract')
    const [blocks, setBlocks] = useState<Block[]>(initialData?.blocks || [])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState('')

    async function handleGenerate() {
        setLoading(true)
        setSaveMessage('')
        try {
            const result = await generateContract(prompt, 'en')
            setTitle(result.title)
            setBlocks(result.blocks)
        } catch (error) {
            console.error(error)
            setSaveMessage('Error generating contract')
        } finally {
            setLoading(false)
        }
    }

    async function handleSave(isTemplate: boolean = false) {
        setSaving(true)
        setSaveMessage('')
        try {
            await createContract(title, { title, blocks, legal_context: 'en' }, isTemplate)
            setSaveMessage(isTemplate ? 'Saved as Template' : 'Saved Draft')
        } catch (err) {
            console.error(err)
            setSaveMessage('Failed to save')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 flex flex-col h-[calc(100vh-100px)]">
            <div className="mb-8 flex justify-between items-center gap-4">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-3xl font-bold bg-transparent border-none focus:ring-0 w-full"
                />
                <div className="flex items-center gap-2">
                    {saveMessage && <span className="text-sm text-green-600 animate-pulse">{saveMessage}</span>}
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving || blocks.length === 0}
                        className="bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-muted/80 disabled:opacity-50 text-sm font-medium"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving || blocks.length === 0}
                        className="bg-secondary text-secondary-foreground border border-secondary px-4 py-2 rounded-lg hover:bg-secondary/10 disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                    >
                        Save as Template
                    </button>
                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 whitespace-nowrap">
                        Request Signatures
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-hidden">
                {/* Editor Main Area */}
                <div className="lg:col-span-3 bg-white border border-muted rounded-xl shadow-sm overflow-y-auto p-12 space-y-8 font-serif leading-relaxed">
                    {blocks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic">
                            <p>Type a prompt on the right to start drafting with AI.</p>
                        </div>
                    ) : (
                        blocks.map((block) => (
                            <div key={block.id} className="group relative">
                                {block.type === 'header' && <h2 className="text-xl font-bold uppercase tracking-wider">{block.content}</h2>}
                                {block.type === 'clause' && <p className="text-gray-800">{block.content}</p>}
                                {block.type === 'footer' && <p className="text-sm text-muted-foreground border-t border-muted pt-4 mt-8">{block.content}</p>}
                                <div className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                                    <button className="p-1 hover:bg-muted rounded">⋮</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* AI Sidebar */}
                <div className="space-y-6">
                    <div className="bg-muted/10 border border-muted rounded-xl p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Legal Architect</h3>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. Draft a 6-month consulting agreement for a UI designer in Norway..."
                            className="w-full bg-background border-muted rounded-lg p-3 text-sm h-32 focus:ring-primary focus:border-primary"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full mt-4 bg-foreground text-background py-3 rounded-lg text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 transition-all"
                        >
                            {loading ? 'Thinking...' : 'Generate with Gemini'}
                        </button>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-primary mb-2 italic">Context: EEA Law</h3>
                        <p className="text-xs text-muted-foreground">Paktio automatically applies relevant regional law based on your organization settings.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
