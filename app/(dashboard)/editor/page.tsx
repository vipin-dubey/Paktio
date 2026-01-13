import ContractEditor from '@/components/features/editor/contract-editor'
import { getContract } from '@/lib/dal/contracts'
import { redirect } from 'next/navigation'

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const { id } = await searchParams
    let initialData = undefined

    if (id) {
        const contract = await getContract(id)
        if (contract) {
            initialData = {
                title: contract.content.title || contract.title,
                blocks: contract.content.blocks || [],
                id: contract.id,
                party_roles: contract.content.party_roles
            }
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <ContractEditor initialData={initialData} />
        </div>
    )
}
