import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PrintButton } from '@/components/features/contract/print-button'

export default async function ViewContractPage({
    params
}: {
    params: Promise<{ contractId: string }>
}) {
    const supabase = await createClient()
    const { contractId } = await params

    const { data: contract, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single()

    if (error || !contract) {
        return notFound()
    }

    const blocks = contract.content_json?.blocks || []

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-12 no-print">
                    <Link
                        href={`/history/${contractId}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Details
                    </Link>

                    <PrintButton />
                </div>

                {/* Contract Body */}
                <article className="prose prose-stone max-w-none">
                    <header className="mb-12 text-center border-b pb-8">
                        <h1 className="text-3xl font-bold mb-2">{contract.title}</h1>
                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                            Reference: {contractId} • v{contract.version}
                        </p>
                    </header>

                    <div className="space-y-6">
                        {blocks.map((block: any) => (
                            <div key={block.id}>
                                {block.type === 'header' && (
                                    <h2 className="text-xl font-bold mt-8 mb-4 border-l-4 border-primary pl-4">
                                        {block.content}
                                    </h2>
                                )}
                                {block.type === 'clause' && (
                                    <p className="text-base leading-relaxed text-foreground/90">
                                        {block.content}
                                    </p>
                                )}
                                {block.type === 'list' && (
                                    <div className="flex gap-4 mb-3 ml-4">
                                        <span className="text-primary font-bold">•</span>
                                        <p className="text-base leading-relaxed">{block.content}</p>
                                    </div>
                                )}
                                {block.type === 'footer' && (
                                    <p className="text-sm text-muted-foreground mt-12 border-t pt-6 italic text-center">
                                        {block.content}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <footer className="mt-20 pt-12 border-t border-muted text-center text-xs text-muted-foreground italic no-print">
                        This is a cryptographically verified document produced by Paktio.
                        Any modification will be detectable via SHA-256 integrity checks.
                    </footer>
                </article>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; padding: 0; }
                    article { padding: 40px; }
                }
            `}} />
        </div>
    )
}
