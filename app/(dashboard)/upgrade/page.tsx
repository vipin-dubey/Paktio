import { getSubscriptionStatus } from './actions'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export default async function UpgradePage() {
    const plan = await getSubscriptionStatus()

    const tiers = [
        {
            name: "Starter",
            price: "$0",
            description: "Perfect for freelancers. 3 contracts/month.",
            features: ["AI Contract Drafting", "SHA-256 Integrity", "Public Signing links"],
            current: plan === 'free'
        },
        {
            name: "Pro",
            price: "$29",
            description: "For small teams and legal pros.",
            features: ["Unlimited Contracts", "MFA Authentication", "Custom Branding", "Priority Support"],
            current: plan === 'subscription'
        }
    ]

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <Breadcrumbs
                items={[
                    { label: 'Upgrade Plan' }
                ]}
            />
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">Choose your plan</h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground italic">
                    High-end agreement management tailored for Scandinavian precision.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {tiers.map((tier) => (
                    <div key={tier.name} className={`relative flex flex-col p-8 bg-white border ${tier.current ? 'border-primary ring-1 ring-primary' : 'border-muted'} rounded-2xl shadow-sm`}>
                        {tier.current && (
                            <span className="absolute top-0 -translate-y-1/2 left-8 bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full">
                                Current Plan
                            </span>
                        )}
                        <h3 className="text-2xl font-bold text-foreground">{tier.name}</h3>
                        <p className="mt-4 text-sm text-muted-foreground">{tier.description}</p>
                        <p className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-4xl font-bold tracking-tight text-foreground">{tier.price}</span>
                            <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
                        </p>

                        <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground flex-1">
                            {tier.features.map((feature) => (
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
                            {tier.current ? 'Your current plan' : 'Upgrade to ' + tier.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
