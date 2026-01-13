import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex mb-6", className)}>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link
                    href="/dashboard"
                    className="flex items-center hover:text-foreground transition-colors"
                >
                    <Home className="w-4 h-4 mr-1" />
                    <span className="sr-only">Dashboard</span>
                </Link>

                {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-foreground transition-colors whitespace-nowrap"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground font-medium truncate max-w-[200px]">
                                {item.label}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    )
}
