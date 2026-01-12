import { createClient } from '@/lib/supabase/server'

export default async function HistoryPage({ params }: { params: { contractId: string } }) {
    const supabase = await createClient()
    const { contractId } = await params

    const { data: contract } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single()

    const { data: signatures } = await supabase
        .from('signatures')
        .select('*')
        .eq('contract_id', contractId)
        .order('signed_at', { ascending: false })

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Contract History: {contract?.title}</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4">Current Version: {contract?.version}</h2>
                    <div className="bg-white border border-muted rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-muted-foreground font-mono">HASH: {contract?.current_hash}</p>
                                <p className="text-sm text-muted-foreground">Last updated: {new Date(contract?.updated_at || '').toLocaleString()}</p>
                            </div>
                            <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${contract?.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                                {contract?.status}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Signature Audit Log</h2>
                    {signatures && signatures.length > 0 ? (
                        <div className="overflow-hidden border border-muted rounded-xl bg-white">
                            <table className="min-w-full divide-y divide-muted">
                                <thead className="bg-muted/5">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Signer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Version</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-muted">
                                    {signatures.map((sig) => (
                                        <tr key={sig.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{sig.signer_email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(sig.signed_at).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">v{sig.version_signed}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">No signatures recorded yet.</p>
                    )}
                </section>

                <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
                    <h3 className="text-amber-800 font-bold mb-2">Integrity Note</h3>
                    <p className="text-sm text-amber-700 leading-relaxed">
                        Paktio uses a SHA-256 hashing algorithm to ensure document immutability. If the content is modified after a signature is applied, all previous signatures are automatically voided and the version counter is incremented.
                    </p>
                </div>
            </div>
        </div>
    )
}
