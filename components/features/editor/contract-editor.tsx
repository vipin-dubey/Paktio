'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { generateContract } from '@/lib/actions/gemini'
import { createContract, updateContract } from '@/lib/dal/contracts'
import type { ContractBlock } from '@/lib/types/database'
import { requestSignatures } from '@/lib/actions/editor'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Trash2, Plus, MoveUp, MoveDown, Sparkles, FileLineChart, List, Heading1, AlignLeft, Type, Eye, X, PanelLeftClose, Layout, FilePenLine, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

type Block = ContractBlock

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
    const [showSidebar, setShowSidebar] = useState(true)

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
        } catch (error: any) {
            console.error(error)
            const errorMessage = error?.message || 'Failed to send request'
            setSaveMessage(`Error: ${errorMessage}`)
            // Reset message after delay
            setTimeout(() => setSaveMessage(''), 5000)
        } finally {
            setSendingRequest(false)
        }
    }


    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#F9F9F8]">
            {/* Cockpit Header */}
            <header className="h-14 shrink-0 border-b border-muted bg-white z-30">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className={cn(
                                "p-2 hover:bg-muted/50 rounded-lg transition-colors",
                                showSidebar ? "text-primary bg-primary/5" : "text-muted-foreground"
                            )}
                            title={showSidebar ? "Hide Tools" : "Show Tools"}
                        >
                            <Layout className="w-4 h-4" />
                        </button>
                        <div className="hidden sm:block h-4 w-[1px] bg-muted mx-1" />
                        <div className="truncate">
                            <Breadcrumbs
                                items={[
                                    { label: contractId ? 'Edit' : 'Drafting', icon: FilePenLine }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {saveMessage && (
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full animate-in fade-in slide-in-from-top-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{saveMessage}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                                onClick={() => setShowPreview(true)}
                                className="p-2 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                                title="Preview Document"
                            >
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            <button
                                onClick={() => handleSave(false)}
                                disabled={saving || (blocks.length === 0 && title === 'Untitled Contract')}
                                className="bg-white border border-muted text-foreground px-3 sm:px-4 py-1.5 rounded-lg hover:bg-muted/10 disabled:opacity-50 text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-sm"
                            >
                                <span className="hidden sm:inline">Save Draft</span>
                                <span className="sm:hidden">Save</span>
                            </button>

                            <button
                                onClick={handleRequestSignatures}
                                disabled={saving || blocks.length === 0 || signatureRequested}
                                className="bg-foreground text-background px-4 sm:px-6 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-50 text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg shadow-foreground/10"
                            >
                                {signatureRequested ? 'Sent' : (
                                    <>
                                        <span className="hidden sm:inline">Request Signature</span>
                                        <span className="sm:hidden">Send</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden">
                <div className="max-w-7xl mx-auto h-full flex overflow-hidden">
                    {/* Collapsible Sidebar (Architect & Roles) */}
                    <aside
                        className={cn(
                            "fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-white border-r border-muted transition-transform duration-300 transform lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
                            showSidebar ? "translate-x-0" : "-translate-x-full"
                        )}
                    >
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b border-muted flex items-center justify-between lg:hidden">
                                <h3 className="text-xs font-black uppercase tracking-widest">Editor Tools</h3>
                                <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-muted rounded-full">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 custom-scrollbar">
                                {/* AI Legal Architect Section */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Legal Architect</h3>
                                    </div>
                                    <div className="bg-[#F9F9F8] rounded-xl p-4 space-y-3">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Draft a 6-month consulting agreement..."
                                            className="w-full bg-transparent border-none p-0 text-sm h-32 focus:ring-0 placeholder:text-muted-foreground/40 resize-none leading-relaxed"
                                        />
                                        <button
                                            onClick={handleGenerate}
                                            disabled={loading || !prompt}
                                            className="w-full bg-foreground text-background py-2.5 rounded-lg font-black uppercase tracking-widest text-[9px] hover:opacity-90 disabled:opacity-50 transition-all flex justify-center items-center gap-2 shadow-sm"
                                        >
                                            {loading ? <span className="animate-spin text-lg">⟳</span> : 'Generate Draft'}
                                        </button>
                                    </div>
                                </section>

                                {/* Document Roles Section */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileLineChart className="w-3.5 h-3.5 text-primary" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Document Roles</h3>
                                    </div>
                                    <div className="space-y-4 px-1">
                                        <div className="space-y-2">
                                            <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Primary Entity</label>
                                            <input
                                                type="text"
                                                value={ownerLabel}
                                                onChange={(e) => setOwnerLabel(e.target.value)}
                                                className="w-full bg-[#F9F9F8] border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary/20 transition-all"
                                                placeholder="e.g. Landlord"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Counterparty</label>
                                            <input
                                                type="text"
                                                value={signerLabel}
                                                onChange={(e) => setSignerLabel(e.target.value)}
                                                className="w-full bg-[#F9F9F8] border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary/20 transition-all"
                                                placeholder="e.g. Tenant"
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </aside>

                    {/* Main Drafting Canvas */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[#F9F9F8]">
                        {/* Document Title Header */}
                        <div className="bg-white border-b border-muted px-6 sm:px-12 py-6 sm:py-8 shrink-0">
                            <div className="max-w-3xl mx-auto w-full">
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Untitled Contract"
                                    className="text-xl sm:text-3xl font-black tracking-tighter bg-transparent border-none focus:ring-0 w-full placeholder:text-muted/20 uppercase"
                                />
                            </div>
                        </div>

                        {/* Scrollable Editor Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="max-w-3xl mx-auto w-full px-6 sm:px-12 py-12 sm:py-20 min-h-full bg-white shadow-sm border-x border-muted/30">
                                {blocks.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center space-y-8 py-20 text-center">
                                        <div className="space-y-3">
                                            <div className="w-16 h-16 bg-muted/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dashed border-muted">
                                                <Sparkles className="w-6 h-6 text-muted-foreground/40" />
                                            </div>
                                            <h3 className="text-lg font-bold tracking-tight">Draft from scratch or use AI</h3>
                                            <p className="text-sm text-muted-foreground max-w-xs mx-auto italic font-serif">
                                                Start typing below to manually build your contract or use the Legal Architect for a baseline.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                                            <button onClick={() => addBlock('header')} className="flex items-center justify-center gap-2 px-6 py-3 border border-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/5 hover:border-foreground transition-all">
                                                <Heading1 className="w-4 h-4" /> Add Header
                                            </button>
                                            <button onClick={() => addBlock('clause')} className="flex items-center justify-center gap-2 px-6 py-3 border border-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/5 hover:border-foreground transition-all">
                                                <AlignLeft className="w-4 h-4" /> Add Clause
                                            </button>
                                            <Link href="/templates" className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/5 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all sm:col-span-2">
                                                <BookOpen className="w-4 h-4" /> Choose from Templates
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {blocks.map((block, index) => {
                                            const isList = block.type === 'list';
                                            const isHeader = block.type === 'header';
                                            const prevBlock = blocks[index - 1];
                                            const isFollowUpList = isList && prevBlock?.type === 'list';

                                            return (
                                                <div
                                                    key={block.id}
                                                    className={cn(
                                                        "group relative px-0 sm:px-12 -mx-0 sm:-mx-12 border-l-2 border-transparent hover:border-primary/20 transition-all hover:bg-muted/5 rounded-r-xl",
                                                        isHeader ? (index === 0 ? "py-2 mt-0" : "py-2 mt-10") :
                                                            isList ? (isFollowUpList ? "py-1" : "py-2") :
                                                                "py-2",
                                                    )}
                                                >
                                                    {/* Left Side Controls - Hidden on Mobile */}
                                                    <div className="absolute -left-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex flex-col items-center top-4 gap-1 transform -translate-x-full pr-4">
                                                        <button onClick={() => moveBlock(index, 'up')} className="p-1 hover:bg-white rounded border border-muted/50 transition-all" title="Move Up"><MoveUp className="w-3 h-3 text-muted-foreground" /></button>

                                                        <div className="relative group/type">
                                                            <button className="p-1.5 hover:bg-white rounded border border-muted/50 transition-all">
                                                                {block.type === 'header' && <Heading1 className="w-3.5 h-3.5 text-primary" />}
                                                                {block.type === 'clause' && <AlignLeft className="w-3.5 h-3.5 text-primary" />}
                                                                {block.type === 'list' && <List className="w-3.5 h-3.5 text-primary" />}
                                                                {block.type === 'footer' && <Type className="w-3.5 h-3.5 text-primary" />}
                                                            </button>
                                                            <div className="absolute left-full top-0 ml-2 hidden group-hover/type:flex bg-white border border-muted rounded-xl p-1 shadow-xl z-20 gap-1 items-center animate-in zoom-in-95">
                                                                <button onClick={() => updateBlockType(block.id, 'header')} className={cn("p-2 rounded hover:bg-muted/10", block.type === 'header' && "bg-primary/5 text-primary")} title="Header"><Heading1 className="w-3.5 h-3.5" /></button>
                                                                <button onClick={() => updateBlockType(block.id, 'clause')} className={cn("p-2 rounded hover:bg-muted/10", block.type === 'clause' && "bg-primary/5 text-primary")} title="Clause"><AlignLeft className="w-3.5 h-3.5" /></button>
                                                                <button onClick={() => updateBlockType(block.id, 'list')} className={cn("p-2 rounded hover:bg-muted/10", block.type === 'list' && "bg-primary/5 text-primary")} title="List"><List className="w-3.5 h-3.5" /></button>
                                                                <button onClick={() => updateBlockType(block.id, 'footer')} className={cn("p-2 rounded hover:bg-muted/10", block.type === 'footer' && "bg-primary/5 text-primary")} title="Footer"><Type className="w-3.5 h-3.5" /></button>
                                                            </div>
                                                        </div>

                                                        <button onClick={() => moveBlock(index, 'down')} className="p-1 hover:bg-white rounded border border-muted/50 transition-all" title="Move Down"><MoveDown className="w-3 h-3 text-muted-foreground" /></button>
                                                    </div>

                                                    {/* Block Content Renderers */}
                                                    <div className="flex gap-4">
                                                        {block.type === 'list' && (
                                                            <div className="pt-2 sm:pt-4 text-muted-foreground font-bold shrink-0 w-4 sm:w-6 text-right select-none">
                                                                •
                                                            </div>
                                                        )}

                                                        <div className="flex-1">
                                                            {block.type === 'header' && (
                                                                <textarea
                                                                    value={block.content}
                                                                    onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                                                    className="w-full text-base sm:text-lg font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 p-0 resize-none overflow-hidden h-auto leading-relaxed placeholder:text-muted-foreground/30 text-foreground"
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
                                                                    className="w-full text-gray-800 bg-transparent border-none focus:ring-0 p-0 resize-none font-serif leading-relaxed sm:leading-[1.8] text-base sm:text-lg h-auto placeholder:text-muted-foreground/30"
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
                                                                    className="w-full text-gray-800 bg-transparent border-none focus:ring-0 p-0 resize-none font-serif leading-relaxed text-base sm:text-lg h-auto placeholder:text-muted-foreground/30"
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
                                                                    className="w-full text-[10px] text-muted-foreground border-t border-muted/50 pt-2 mt-4 bg-transparent border-none focus:ring-0 p-0 resize-none h-auto italic uppercase tracking-widest placeholder:text-muted-foreground/40"
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
                                                    <div className="absolute -right-1 sm:right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                        <button
                                                            onClick={() => removeBlock(block.id)}
                                                            className="p-1.5 sm:p-2 hover:bg-red-50 text-red-200 hover:text-red-500 rounded-lg transition-all"
                                                            title="Delete Block"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Add Block Tool Bar */}
                                        <div className="flex flex-col items-center pt-12 pb-16">
                                            <div className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/40 uppercase mb-6 flex items-center gap-4 before:h-[1px] before:w-12 before:bg-muted/30 after:h-[1px] after:w-12 after:bg-muted/30">
                                                Insert Section
                                            </div>
                                            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 opacity-70 hover:opacity-100 transition-opacity">
                                                <button onClick={() => addBlock('header')} className="text-[9px] font-black uppercase tracking-widest border border-dashed border-muted px-4 py-2.5 rounded-full hover:border-foreground hover:bg-white transition-all flex items-center gap-2">
                                                    <Plus className="w-2.5 h-2.5" /> Header
                                                </button>
                                                <button onClick={() => addBlock('clause')} className="text-[9px] font-black uppercase tracking-widest border border-dashed border-muted px-4 py-2.5 rounded-full hover:border-foreground hover:bg-white transition-all flex items-center gap-2">
                                                    <Plus className="w-2.5 h-2.5" /> Clause
                                                </button>
                                                <button onClick={() => addBlock('list')} className="text-[9px] font-black uppercase tracking-widest border border-dashed border-muted px-4 py-2.5 rounded-full hover:border-foreground hover:bg-white transition-all flex items-center gap-2">
                                                    <List className="w-2.5 h-2.5" /> List Item
                                                </button>
                                                <button onClick={() => addBlock('footer')} className="text-[9px] font-black uppercase tracking-widest border border-dashed border-muted px-4 py-2.5 rounded-full hover:border-foreground hover:bg-white transition-all flex items-center gap-2">
                                                    <Plus className="w-2.5 h-2.5" /> Footer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Request Signature Modal */}
            {showSignerModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="space-y-2">
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">Send Request</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Enter the counterparty's email. They'll receive a secure link to sign.
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
                                    className="flex-[2] bg-foreground text-background px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-foreground/20"
                                >
                                    {sendingRequest ? 'Dispatching...' : 'Request Signature'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110] p-4 sm:p-8 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] sm:rounded-[40px] w-full max-w-4xl h-full flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-6 sm:p-8 border-b border-muted flex justify-between items-center bg-muted/5">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Document Preview</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">This is how your contract will appear to signers.</p>
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 sm:p-3 hover:bg-muted rounded-full transition-all"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 sm:p-16 bg-[#F9F9F8] custom-scrollbar">
                            <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 sm:p-16 shadow-sm border border-muted/50 rounded-xl">
                                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-8">{title}</h1>

                                <div className="space-y-4">
                                    {blocks.map((block, i) => {
                                        if (block.type === 'header') return <h2 key={i} className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] pt-8 border-b border-muted pb-2 mb-2">{block.content}</h2>
                                        if (block.type === 'clause') return <p key={i} className="text-base sm:text-lg leading-relaxed font-serif text-gray-800">{block.content}</p>
                                        if (block.type === 'list') return (
                                            <div key={i} className="flex gap-3 pl-4">
                                                <span className="text-muted-foreground font-bold text-xs">•</span>
                                                <p className="text-base sm:text-lg leading-relaxed font-serif text-gray-700">{block.content}</p>
                                            </div>
                                        )
                                        if (block.type === 'footer') return <p key={i} className="text-[9px] text-muted-foreground border-t border-muted/30 pt-6 mt-12 italic text-center uppercase tracking-widest">{block.content}</p>
                                        return null
                                    })}
                                </div>

                                <div className="mt-20 pt-12 border-t border-muted grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{ownerLabel}</p>
                                        <div className="h-24 bg-muted/5 rounded-2xl border border-dashed border-muted flex items-center justify-center italic text-muted-foreground/30 text-xs text-center px-4">
                                            Signature Placeholder
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{signerLabel}</p>
                                        <div className="h-24 bg-muted/5 rounded-2xl border border-dashed border-muted flex items-center justify-center italic text-muted-foreground/30 text-xs text-center px-4">
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
