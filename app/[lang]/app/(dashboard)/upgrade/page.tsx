import { getSubscriptionStatus } from '@/lib/actions/upgrade'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Plus, Zap } from 'lucide-react'
import Link from 'next/link'
import { getDictionary } from '@/app/[lang]/dictionaries/get-dictionary'

export default async function UpgradePage({
    params
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const dictionary = await getDictionary(lang)
    const plan = await getSubscriptionStatus()

    const tiers = [
        {
            id: 'starter',
            name: dictionary.upgrade.tiers.starter.name,
            price: dictionary.upgrade.tiers.starter.price,
            description: dictionary.upgrade.tiers.starter.description,
            features: dictionary.upgrade.tiers.starter.features,
            current: plan === 'free'
        },
        {
            id: 'pro',
            name: dictionary.upgrade.tiers.pro.name,
            price: dictionary.upgrade.tiers.pro.price,
            description: dictionary.upgrade.tiers.pro.description,
            features: dictionary.upgrade.tiers.pro.features,
            current: plan === 'subscription'
        }
    ]

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="mb-6 flex items-center justify-between gap-4">
                <Breadcrumbs
                    items={[
                        { label: dictionary.upgrade.title, icon: Zap }
                    ]}
                />
                <Link
                    href="/editor"
                    className="sm:hidden bg-foreground text-background p-3 rounded-2xl shadow-lg shadow-foreground/10 flex items-center justify-center transition-all active:scale-95 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                </Link>
            </div>
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">{dictionary.upgrade.title}</h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground italic">
                    {dictionary.upgrade.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {tiers.map((tier) => (
                    <div key={tier.id} className={`relative flex flex-col p-8 bg-white border ${tier.current ? 'border-primary ring-1 ring-primary' : 'border-muted'} rounded-2xl shadow-sm`}>
                        {tier.current && (
                            <span className="absolute top-0 -translate-y-1/2 left-8 bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full">
                                {dictionary.upgrade.current}
                            </span>
                        )}
                        <h3 className="text-2xl font-bold text-foreground">{tier.name}</h3>
                        <p className="mt-4 text-sm text-muted-foreground">{tier.description}</p>
                        <p className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-4xl font-bold tracking-tight text-foreground">{tier.price}</span>
                            <span className="text-sm font-semibold leading-6 text-muted-foreground">{dictionary.upgrade.monthly}</span>
                        </p>

                        <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground flex-1">
                            {tier.features.map((feature: string) => (
                                <li key={feature} className="flex gap-x-3">
                                    <span className="text-primary font-bold">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled={tier.current}
                            className={`mt-8 block w-full rounded-lg px-3 py-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${tier.current
                                ? 'bg-muted text-muted-foreground cursor-default'
                                : 'bg-primary text-primary-foreground hover:opacity-90 transition-opacity ring-1 ring-inset ring-primary'
                                }`}
                        >
                            {tier.current ? dictionary.upgrade.currentLabel : dictionary.upgrade.upgradeTo + tier.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
