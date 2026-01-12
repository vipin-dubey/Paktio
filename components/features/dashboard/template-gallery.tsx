'use client'

import { useState } from 'react'
import { FileText, Copy, Loader2, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ContractDTO } from '@/lib/types/database'
import { duplicateContract } from '@/lib/dal/contracts'

export default function TemplateGallery({ templates }: { templates: ContractDTO[] }) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    async function handleUseTemplate(templateId: string) {
        setLoadingId(templateId)
        try {
            const newContractId = await duplicateContract(templateId)
            router.push(`/editor?id=${newContractId}`)
        } catch (error) {
            console.error('Failed to copy template:', error)
            alert('Failed to use template')
        } finally {
            setLoadingId(null)
        }
    }

    if (templates.length === 0) {
        return (
            <div className="bg-muted/10 border border-dashed border-muted rounded-xl p-8 text-center">
                <p className="text-muted-foreground text-sm">No templates found. Create one to get started.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
                <div key={template.id} className="group bg-white border border-muted rounded-xl p-6 hover:shadow-lg transition-all relative overflow-hidden">
                    {/* Badge for System Templates (no org_id or explicit check if we had it, but for now we assume global if in this list) */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>

                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-secondary/10 rounded-lg">
                            <FileText className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <span className="bg-muted/20 text-xs px-2 py-1 rounded-md text-muted-foreground uppercase tracking-wider font-bold">
                            Template
                        </span>
                    </div>

                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">{template.title}</h3>
                    <p className="text-xs text-muted-foreground mb-6">
                        Updated {new Date(template.updated_at).toLocaleDateString()}
                    </p>

                    <button
                        onClick={() => handleUseTemplate(template.id)}
                        disabled={loadingId === template.id}
                        className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        {loadingId === template.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Use Template
                            </>
                        )}
                    </button>
                </div>
            ))}
        </div>
    )
}
