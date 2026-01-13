'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateContract } from '@/app/actions/gemini'
import { createContract, updateContract } from '@/lib/dal/contracts'
import type { ContractBlock } from '@/lib/types/database'
import { requestSignatures } from '@/app/(dashboard)/editor/actions'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Trash2, Plus, MoveUp, MoveDown, HelpCircle, Sparkles, FileLineChart, List, ListOrdered, Heading1, AlignLeft, Type, Eye, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Block extends ContractBlock { }

interface ContractEditorProps {
    initialData?: {
        title: string
        blocks: Block[]
        id?: string
        party_roles?: {
            owner_label?: string
            signer_label?: string
        }
    }
}

export default function ContractEditor({ initialData }: ContractEditorProps) {
    const router = useRouter()
    const [prompt, setPrompt] = useState('')
    const [title, setTitle] = useState(initialData?.title || 'Untitled Contract')
    const [blocks, setBlocks] = useState<Block[]>(initialData?.blocks || [])
    const [contractId, setContractId] = useState<string | undefined>(initialData?.id)
    const [ownerLabel, setOwnerLabel] = useState(initialData?.party_roles?.owner_label || 'Contract Owner')
    const [signerLabel, setSignerLabel] = useState(initialData?.party_roles?.signer_label || 'Signer')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState('')

    // Signature Request State
    const [showSignerModal, setShowSignerModal] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [signerEmail, setSignerEmail] = useState('')
    const [sendingRequest, setSendingRequest] = useState(false)
    const [signatureRequested, setSignatureRequested] = useState(false)

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
            const content = {
                title,
                blocks,
                legal_context: 'en',
                party_roles: {
                    owner_label: ownerLabel,
                    signer_label: signerLabel
                }
            }
            let activeId = contractId
            if (contractId) {
                await updateContract(contractId, content, isTemplate)
            } else {
                activeId = await createContract(title, content, isTemplate)
                if (!isTemplate && activeId) {
                    setContractId(activeId)
                    router.replace(`/editor?id=${activeId}`)
                }
            }

            setSaveMessage(isTemplate ? 'Saved as Template' : 'Saved Draft')
            return activeId
        } catch (err) {
            console.error(err)
            setSaveMessage('Failed to save')
            return null
        } finally {
            setSaving(false)
        }
    }

    const addBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: crypto.randomUUID(),
            type,
            content: ''
        }
        setBlocks([...blocks, newBlock])
    }

    const updateBlockContent = (id: string, content: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b))
    }

    const updateBlockType = (id: string, type: Block['type']) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, type } : b))
    }

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id))
    }

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...blocks]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= blocks.length) return
        const [movedBlock] = newBlocks.splice(index, 1)
        newBlocks.splice(targetIndex, 0, movedBlock)
        setBlocks(newBlocks)
    }

    async function handleRequestSignatures() {
        setSaveMessage('Saving changes before requesting signature...')
        const currentId = await handleSave(false)
        if (!currentId) return
        setShowSignerModal(true)
    }

    async function submitSignatureRequest() {
        if (!signerEmail || !contractId) return

        setSendingRequest(true)
        try {
            await requestSignatures(contractId, [{ email: signerEmail }])
            setSignatureRequested(true)
            setShowSignerModal(false)
            setSignerEmail('')
        } catch (error) {
            console.error(error)
            setSaveMessage('Failed to send request')
        } finally {
            setSendingRequest(false)
        }
    }

    // Helper to determine list index (for numbered lists)
    const getListIndex = (currentIndex: number) => {
        let count = 0;
        for (let i = 0; i <= currentIndex; i++) {
            if (blocks[i].type === 'list') {
                // Check if the previous one was also a list to see if they are part of a continuous sequence
                // For now, simpler: just count consecutive list items of same "implied numbering"
                count++;
            } else {
                count = 0;
            }
        }
        return count;
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col h-[calc(100vh-80px)]">
            <div className="mb-6 flex items-center justify-between">
                <Breadcrumbs
                    items={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: contractId ? 'Edit Contract' : 'Drafting' }
                    ]}
                />
                <div className="flex items-center gap-3">
                    {saveMessage && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{saveMessage}</span>}
                    <button
                        onClick={() => setShowPreview(true)}
                        className="bg-white border border-muted text-foreground p-2 rounded-xl hover:bg-muted/10 transition-all shadow-sm"
                        title="Preview Document"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving || (blocks.length === 0 && title === 'Untitled Contract')}
                        className="bg-white border border-muted text-foreground px-5 py-2 rounded-xl hover:bg-muted/10 disabled:opacity-50 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={handleRequestSignatures}
                        disabled={saving || blocks.length === 0 || signatureRequested}
                        className="bg-foreground text-background px-6 py-2 rounded-xl hover:opacity-90 disabled:opacity-50 text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-foreground/10"
                    >
                        {signatureRequested ? 'Sent' : 'Request Signature'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* AI & Roles Sidebar */}
                <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
                    <div className="bg-white border border-muted rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Legal Architect</h3>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Draft a 6-month consulting agreement..."
                            className="w-full bg-[#F9F9F8] border-none rounded-xl p-4 text-sm h-32 focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 resize-none"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt}
                            className="w-full bg-foreground text-background py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                        >
                            {loading ? <span className="animate-spin text-lg">⟳</span> : 'Generate Draft'}
                        </button>
                    </div>

                    <div className="bg-white border border-muted rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <FileLineChart className="w-4 h-4 text-primary" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Document Roles</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-2">Primary Entity</label>
                                <input
                                    type="text"
                                    value={ownerLabel}
                                    onChange={(e) => setOwnerLabel(e.target.value)}
                                    className="w-full bg-[#F9F9F8] border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary"
                                    placeholder="e.g. Landlord"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-2">Counterparty</label>
                                <input
                                    type="text"
                                    value={signerLabel}
                                    onChange={(e) => setSignerLabel(e.target.value)}
                                    className="w-full bg-[#F9F9F8] border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary"
                                    placeholder="e.g. Tenant"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor Main Area */}
                <div className="lg:col-span-9 bg-white border border-muted rounded-3xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-muted">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Document Title"
                            className="text-2xl font-bold bg-transparent border-none focus:ring-0 w-full placeholder:text-muted/30"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                        {blocks.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-6 py-20">
                                <div className="text-center space-y-2">
                                    <p className="text-muted-foreground italic font-serif">Start with AI or begin drafting manually.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => addBlock('header')} className="flex items-center gap-2 px-6 py-3 border border-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/5 transition-all">
                                        <Heading1 className="w-4 h-4" /> Add Header
                                    </button>
                                    <button onClick={() => addBlock('clause')} className="flex items-center gap-2 px-6 py-3 border border-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/5 transition-all">
                                        <AlignLeft className="w-4 h-4" /> Add Clause
                                    </button>
                                    <button onClick={() => addBlock('list')} className="flex items-center gap-2 px-6 py-3 border border-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/5 transition-all text-muted-foreground">
                                        <List className="w-4 h-4" /> Add List Item
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="">
                                {blocks.map((block, index) => {
                                    const isList = block.type === 'list';
                                    const isHeader = block.type === 'header';
                                    const prevBlock = blocks[index - 1];
                                    const isFollowUpList = isList && prevBlock?.type === 'list';

                                    return (
                                        <div
                                            key={block.id}
                                            className={cn(
                                                "group relative pr-12 pl-12 border-l-2 border-transparent hover:border-muted transition-all rounded-r-xl hover:bg-muted/5",
                                                isHeader ? (index === 0 ? "py-1 mt-0" : "py-1 mt-6") :
                                                    isList ? (isFollowUpList ? "py-0.25 mt-0" : "py-0.5 mt-1.5") :
                                                        "py-0.5 mt-1.5",
                                                index === 0 && !isHeader && "mt-0"
                                            )}
                                        >
                                            {/* Left Side Controls (Move & Type Switch) */}
                                            <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-1 w-10">
                                                <button onClick={() => moveBlock(index, 'up')} className="p-1 hover:bg-white rounded shadow-sm border border-muted/50 transition-all" title="Move Up"><MoveUp className="w-2.5 h-2.5 text-muted-foreground" /></button>

                                                {/* Type Trigger */}
                                                <div className="relative group/type">
                                                    <button className="p-1.5 hover:bg-white rounded shadow-sm border border-muted/50 transition-all">
                                                        {block.type === 'header' && <Heading1 className="w-3 h-3 text-primary" />}
                                                        {block.type === 'clause' && <AlignLeft className="w-3 h-3 text-primary" />}
                                                        {block.type === 'list' && <List className="w-3 h-3 text-primary" />}
                                                        {block.type === 'footer' && <Type className="w-3 h-3 text-primary" />}
                                                    </button>
                                                    <div className="absolute left-full top-0 ml-2 hidden group-hover/type:flex bg-white border border-muted rounded-xl p-1 shadow-xl z-20 gap-1 animate-in fade-in slide-in-from-left-2 items-center">
                                                        <button onClick={() => updateBlockType(block.id, 'header')} className={cn("p-1.5 rounded hover:bg-muted/10", block.type === 'header' && "bg-primary/10 text-primary")} title="Header"><Heading1 className="w-3 h-3" /></button>
                                                        <button onClick={() => updateBlockType(block.id, 'clause')} className={cn("p-1.5 rounded hover:bg-muted/10", block.type === 'clause' && "bg-primary/10 text-primary")} title="Clause"><AlignLeft className="w-3 h-3" /></button>
                                                        <button onClick={() => updateBlockType(block.id, 'list')} className={cn("p-1.5 rounded hover:bg-muted/10", block.type === 'list' && "bg-primary/10 text-primary")} title="List"><List className="w-3 h-3" /></button>
                                                        <button onClick={() => updateBlockType(block.id, 'footer')} className={cn("p-1.5 rounded hover:bg-muted/10", block.type === 'footer' && "bg-primary/10 text-primary")} title="Footer"><Type className="w-3 h-3" /></button>
                                                    </div>
                                                </div>

                                                <button onClick={() => moveBlock(index, 'down')} className="p-1 hover:bg-white rounded shadow-sm border border-muted/50 transition-all" title="Move Down"><MoveDown className="w-2.5 h-2.5 text-muted-foreground" /></button>
                                            </div>

                                            {/* Block Content Renderers */}
                                            <div className="flex gap-4">
                                                {block.type === 'list' && (
                                                    <div className="pt-2 text-muted-foreground font-bold shrink-0 w-6 text-right">
                                                        •
                                                    </div>
                                                )}

                                                <div className="flex-1">
                                                    {block.type === 'header' && (
                                                        <textarea
                                                            value={block.content}
                                                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                                            className="w-full text-xl font-bold uppercase tracking-wider bg-transparent border-none focus:ring-0 p-0 resize-none overflow-hidden h-auto leading-relaxed placeholder:text-muted/20"
                                                            rows={1}
                                                            onInput={(e) => {
                                                                const target = e.target as HTMLTextAreaElement;
                                                                target.style.height = 'auto';
                                                                target.style.height = target.scrollHeight + 'px';
                                                            }}
                                                            placeholder="SECTION HEADER..."
                                                        />
                                                    )}
                                                    {block.type === 'clause' && (
                                                        <textarea
                                                            value={block.content}
                                                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                                            className="w-full text-gray-800 bg-transparent border-none focus:ring-0 p-0 resize-none font-serif leading-[1.8] text-lg h-auto placeholder:text-muted/20"
                                                            onInput={(e) => {
                                                                const target = e.target as HTMLTextAreaElement;
                                                                target.style.height = 'auto';
                                                                target.style.height = target.scrollHeight + 'px';
                                                            }}
                                                            placeholder="Type a contract clause..."
                                                        />
                                                    )}
                                                    {block.type === 'list' && (
                                                        <textarea
                                                            value={block.content}
                                                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                                            className="w-full text-gray-800 bg-transparent border-none focus:ring-0 p-0 resize-none font-serif leading-relaxed text-lg h-auto placeholder:text-muted/20"
                                                            onInput={(e) => {
                                                                const target = e.target as HTMLTextAreaElement;
                                                                target.style.height = 'auto';
                                                                target.style.height = target.scrollHeight + 'px';
                                                            }}
                                                            placeholder="List item content..."
                                                        />
                                                    )}
                                                    {block.type === 'footer' && (
                                                        <textarea
                                                            value={block.content}
                                                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                                            className="w-full text-[10px] text-muted-foreground border-t border-muted/50 pt-1 mt-2 bg-transparent border-none focus:ring-0 p-0 resize-none h-auto italic uppercase tracking-widest"
                                                            onInput={(e) => {
                                                                const target = e.target as HTMLTextAreaElement;
                                                                target.style.height = 'auto';
                                                                target.style.height = target.scrollHeight + 'px';
                                                            }}
                                                            placeholder="FOOTER TEXT..."
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Side Actions */}
                                            <div className="absolute right-0 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                                                <button
                                                    onClick={() => removeBlock(block.id)}
                                                    className="p-2 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-xl transition-all"
                                                    title="Delete Block"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Add Block Tool Bar */}
                                <div className="flex justify-center pt-8 gap-4 opacity-30 hover:opacity-100 transition-opacity pb-12">
                                    <button onClick={() => addBlock('header')} className="text-[9px] font-black uppercase tracking-widest border border-dashed border-muted px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-all flex items-center gap-2 bg-white">
                                        <Plus className="w-2.5 h-2.5" /> Header
                                    </button>
                                    <button onClick={() => addBlock('clause')} className="text-[9px] font-black uppercase tracking-widest border border-dashed border-muted px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-all flex items-center gap-2 bg-white">
                                        <Plus className="w-2.5 h-2.5" /> Clause
                                    </button>
                                    <button onClick={() => addBlock('list')} className="text-[9px] font-black uppercase tracking-widest border border-dashed border-muted px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-all flex items-center gap-2 bg-white">
                                        <List className="w-2.5 h-2.5" /> List Item
                                    </button>
                                    <button onClick={() => addBlock('footer')} className="text-[9px] font-black uppercase tracking-widest border border-dashed border-muted px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-all flex items-center gap-2 bg-white">
                                        <Plus className="w-2.5 h-2.5" /> Footer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Request Signature Modal remains same */}
            {showSignerModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black tracking-tight">Send Request</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Enter the email of the legal counterparty. They will receive an eIDAS-validated link to sign this document.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 pl-1">Counterparty Email</label>
                                <input
                                    type="email"
                                    value={signerEmail}
                                    onChange={(e) => setSignerEmail(e.target.value)}
                                    placeholder="signer@example.com"
                                    className="w-full bg-[#F9F9F8] border-none rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary shadow-inner"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowSignerModal(false)}
                                    className="flex-1 px-6 py-4 border border-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/5 transition-all text-muted-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitSignatureRequest}
                                    disabled={sendingRequest || !signerEmail}
                                    className="flex-[2] bg-foreground text-background px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-foreground/20 italic"
                                >
                                    {sendingRequest ? 'Dispatching...' : 'Initiate Signing ✦'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-8 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-4xl h-full flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-muted flex justify-between items-center bg-muted/5">
                            <div>
                                <h3 className="text-2xl font-bold">Document Preview</h3>
                                <p className="text-sm text-muted-foreground">This is how your contract will appear to signers.</p>
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-3 hover:bg-muted rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-16 bg-[#F9F9F8]">
                            <div className="max-w-2xl mx-auto space-y-8">
                                <h1 className="text-2xl font-bold tracking-tight mb-8">{title}</h1>

                                <div className="space-y-1.5">
                                    {blocks.map((block, i) => {
                                        if (block.type === 'header') return <h2 key={i} className="text-sm font-bold uppercase tracking-widest pt-4 border-b border-muted pb-1 mb-1">{block.content}</h2>
                                        if (block.type === 'clause') return <p key={i} className="text-base leading-[1.6] font-serif text-gray-800">{block.content}</p>
                                        if (block.type === 'list') return (
                                            <div key={i} className="flex gap-3 pl-4">
                                                <span className="text-muted-foreground font-bold text-xs">•</span>
                                                <p className="text-base leading-relaxed font-serif text-gray-700">{block.content}</p>
                                            </div>
                                        )
                                        if (block.type === 'footer') return <p key={i} className="text-[10px] text-muted-foreground border-t border-muted/30 pt-4 mt-8 italic text-center uppercase tracking-widest">{block.content}</p>
                                        return null
                                    })}
                                </div>

                                <div className="mt-20 pt-12 border-t-2 border-muted grid grid-cols-2 gap-12">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{ownerLabel}</p>
                                        <div className="h-24 bg-muted/5 rounded-2xl border border-dashed border-muted flex items-center justify-center italic text-muted-foreground/30 text-xs">
                                            Signature Placeholder
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{signerLabel}</p>
                                        <div className="h-24 bg-muted/5 rounded-2xl border border-dashed border-muted flex items-center justify-center italic text-muted-foreground/30 text-xs">
                                            Signature Placeholder
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
