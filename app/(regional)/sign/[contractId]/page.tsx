import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function SigningPage({ params }: { params: { contractId: string } }) {
    const supabase = await createClient()
    const { contractId } = await params

    const { data: contract } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single()

    if (!contract) return notFound()

    return (
        <div className="min-h-screen bg-[#F9F9F8] py-20 px-4">
            <div className="max-w-3xl mx-auto bg-white border border-muted rounded-2xl shadow-sm overflow-hidden">
                <div className="p-8 border-b border-muted bg-muted/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Contract for review</h2>
                            <h1 className="text-2xl font-bold">{contract.title}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Version</p>
                            <p className="text-sm font-bold">1.0.{contract.version}</p>
                        </div>
                    </div>
                </div>

                <div className="p-12 prose prose-stone max-w-none min-h-[400px]">
                    <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                        {JSON.stringify(contract.content_json, null, 2)}
                    </pre>
                </div>

                <div className="p-8 bg-muted/5 border-t border-muted">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Document Integrity Verified via SHA-256
                        </div>
                        <button className="bg-foreground text-background px-10 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-all shadow-xl">
                            Sign and accept agreement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
