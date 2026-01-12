'use client'

interface Block {
    id: string
    type: string
    content: string
}

interface ContractViewerProps {
    contentJson: {
        title: string
        blocks: Block[]
    }
}

export default function ContractViewer({ contentJson }: ContractViewerProps) {
    if (!contentJson || !contentJson.blocks) {
        return <p className="text-muted-foreground">No content available</p>
    }

    return (
        <div className="prose prose-stone max-w-none">
            {contentJson.blocks.map((block) => {
                switch (block.type) {
                    case 'header':
                        return (
                            <h2 key={block.id} className="text-xl font-bold mt-6 mb-3">
                                {block.content}
                            </h2>
                        )
                    case 'clause':
                        return (
                            <p key={block.id} className="mb-4 leading-relaxed">
                                {block.content}
                            </p>
                        )
                    case 'list':
                        return (
                            <li key={block.id} className="ml-6 mb-2">
                                {block.content}
                            </li>
                        )
                    default:
                        return (
                            <p key={block.id} className="mb-4">
                                {block.content}
                            </p>
                        )
                }
            })}
        </div>
    )
}
