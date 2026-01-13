'use client'

import { useState } from 'react'
import { FileText, Copy, Loader2 } from 'lucide-react'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
                <div key={template.id} className="group bg-white border border-muted/50 rounded-xl p-3 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px]">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-1.5 bg-secondary/10 rounded-md shrink-0">
                                <FileText className="w-3.5 h-3.5 text-secondary-foreground" />
                            </div>
                            <h3 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">{template.title}</h3>
                        </div>
                        <p className="text-[10px] text-muted-foreground ml-[31px]">
                            v{template.version} • {new Date(template.updated_at).toLocaleDateString()}
                        </p>
                    </div>

                    <button
                        onClick={() => handleUseTemplate(template.id)}
                        disabled={loadingId === template.id}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-muted/50 hover:bg-primary hover:text-white text-foreground py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        {loadingId === template.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <>
                                <Copy className="w-3 h-3" />
                                Use
                            </>
                        )}
                    </button>
                </div>
            ))}
        </div>
    )
}
