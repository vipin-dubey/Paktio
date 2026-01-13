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
                            <h2 key={block.id} className="text-lg sm:text-xl font-black uppercase tracking-widest mt-12 mb-6 text-foreground/90 border-b border-muted pb-2">
                                {block.content}
                            </h2>
                        )
                    case 'clause':
                        return (
                            <p key={block.id} className="mb-6 leading-relaxed font-serif text-base sm:text-lg text-gray-800">
                                {block.content}
                            </p>
                        )
                    case 'list':
                        return (
                            <li key={block.id} className="ml-4 sm:ml-8 mb-3 font-serif text-base sm:text-lg text-gray-800 list-disc">
                                {block.content}
                            </li>
                        )
                    case 'footer':
                        return (
                            <p key={block.id} className="mt-12 pt-4 border-t border-muted/50 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest italic">
                                {block.content}
                            </p>
                        )
                    default:
                        return (
                            <p key={block.id} className="mb-6 font-serif text-base sm:text-lg text-gray-800">
                                {block.content}
                            </p>
                        )
                }
            })}
        </div>
    )
}
