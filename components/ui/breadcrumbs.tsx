import Link from 'next/link'
import { LucideIcon, ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
    label: string
    href?: string
    icon?: LucideIcon
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex", className)}>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Link
                    href="/dashboard"
                    className="flex items-center hover:text-foreground transition-colors p-1"
                >
                    <Home className="w-4 h-4" />
                    <span className="sr-only">Dashboard</span>
                </Link>

                {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <ChevronRight className="w-3.5 h-3.5 mx-0.5 opacity-40 flex-shrink-0" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="flex items-center hover:text-foreground transition-colors p-1 whitespace-nowrap gap-1.5"
                                title={item.label}
                            >
                                {item.icon && <item.icon className="w-4 h-4" />}
                                <span className={cn(item.icon ? "hidden sm:inline" : "inline")}>{item.label}</span>
                            </Link>
                        ) : (
                            <span
                                className="flex items-center text-foreground font-medium truncate max-w-[150px] p-1 gap-1.5"
                                title={item.label}
                            >
                                {item.icon && <item.icon className="w-4 h-4" />}
                                <span className={cn(item.icon ? "hidden sm:inline" : "inline")}>{item.label}</span>
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    )
}
