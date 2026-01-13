'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateContract } from '@/app/actions/gemini'
import { createContract, updateContract } from '@/lib/dal/contracts'
import type { ContractBlock } from '@/lib/types/database'

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

import { requestSignatures } from '@/app/(dashboard)/editor/actions'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

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

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 flex flex-col h-[calc(100vh-100px)]">
            <Breadcrumbs
                items={[
                    { label: contractId ? 'Edit Contract' : 'New Contract' }
                ]}
            />
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
                        className="bg-white border border-muted text-foreground px-6 py-2 rounded-lg hover:bg-muted/10 disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving || blocks.length === 0}
                        className="bg-white border border-muted text-foreground px-6 py-2 rounded-lg hover:bg-muted/10 disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                    >
                        Save as Template
                    </button>
                    <button
                        onClick={handleRequestSignatures}
                        disabled={saving || blocks.length === 0 || signatureRequested}
                        className="bg-foreground text-background px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                    >
                        {signatureRequested ? 'Awaiting Signature' : 'Request Signature'}
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
                            disabled={loading || !prompt}
                            className="w-full bg-foreground text-background py-3 rounded-lg font-bold uppercase tracking-wider text-xs hover:opacity-90 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin text-lg">⟳</span> Generating...
                                </>
                            ) : (
                                <>
                                    <span>✦</span> Generate Draft
                                </>
                            )}
                        </button>
                    </div>

                    <div className="bg-muted/10 border border-muted rounded-xl p-6 space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Party Roles</h3>
                        <div>
                            <label className="block text-xs uppercase text-muted-foreground mb-1">Creator Role (You)</label>
                            <input
                                type="text"
                                value={ownerLabel}
                                onChange={(e) => setOwnerLabel(e.target.value)}
                                className="w-full bg-background border rounded-lg px-3 py-2 text-sm"
                                placeholder="e.g. Landlord"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-muted-foreground mb-1">Signer Role</label>
                            <input
                                type="text"
                                value={signerLabel}
                                onChange={(e) => setSignerLabel(e.target.value)}
                                className="w-full bg-background border rounded-lg px-3 py-2 text-sm"
                                placeholder="e.g. Tenant"
                            />
                        </div>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-primary mb-2 italic">Context: EEA Law</h3>
                        <p className="text-xs text-muted-foreground">Paktio automatically applies relevant regional law based on your organization settings.</p>
                    </div>
                </div>
            </div>

            {/* Request Signature Modal */}
            {showSignerModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Request Signatures</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Enter the email address of the person who needs to sign this contract.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium block mb-1">Signer Email</label>
                                <input
                                    type="email"
                                    value={signerEmail}
                                    onChange={(e) => setSignerEmail(e.target.value)}
                                    placeholder="signer@example.com"
                                    className="w-full border rounded-lg p-2"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowSignerModal(false)}
                                    className="px-4 py-2 hover:bg-muted rounded-lg text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitSignatureRequest}
                                    disabled={sendingRequest || !signerEmail}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                                >
                                    {sendingRequest ? 'Sending...' : 'Send Request'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
