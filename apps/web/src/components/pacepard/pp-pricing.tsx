import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Minus } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: '₦35,000',
        period: '/month',
        cta: 'Get Started',
        link: 'https://paystack.shop/pay/pacepard-basic',
    },
    {
        name: 'Pro',
        price: '₦85,000',
        period: '/month',
        cta: 'Select Plan',
        highlighted: true,
        link: 'https://paystack.shop/pay/pacepard-standard',
    },
    {
        name: 'Team',
        price: '₦124,000',
        period: '/month',
        cta: 'Select Plan',
        link: 'https://paystack.shop/pay/pacepard-premium',
    },
];

// https://paystack.shop/pay/pacepard-membership

const planKeys = ['basic', 'pro', 'team'] as const;

const features = [
    {
        name: 'Learning quests',
        basic: 'unlimited',
        pro: 'Unlimited',
        team: 'Unlimited',
    },
    {
        name: 'Growth quests',
        basic: 'unlimited',
        pro: 'Unlimited',
        team: 'Unlimited',
    },
    { name: 'Live Sessions', basic: true, pro: true, team: true },
    { name: 'Group mentor calls', basic: true, pro: true, team: true },
    { name: '1-on-1 mentor calls', basic: false, pro: true, team: true },
    { name: 'Work within a micro-team', basic: false, pro: true, team: true },
    { name: 'Rotate between teams', basic: false, pro: false, team: true },
    { name: 'Rotate across projects', basic: false, pro: false, team: true },
    { name: 'Pacepard talent pool', basic: true, pro: true, team: true },
    { name: 'Pacepard community', basic: true, pro: true, team: true },
    // { name: 'API Calls', basic: '10K/mo', pro: '100K/mo', team: '1M/mo' },
    // { name: 'Team Members', basic: '1', pro: '5', team: 'Unlimited' },
    // { name: 'Priority Support', basic: 'Email', pro: 'Priority', team: 'Dedicated' },
];

function FeatureValue({ value }: { value: string | boolean }) {
    if (typeof value === 'boolean') {
        return value ? (
            <Check className="text-primary size-4 shrink-0" />
        ) : (
            <Minus className="text-muted-foreground size-4 shrink-0" />
        );
    }
    return <span className="text-foreground">{value}</span>;
}

export default function Comparator() {
    return (
        <section className="bg-background @container pt-21">
            <div className="mx-auto max-w-4xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-regular">
                    Flexible plans for builders and teams
                    </h2>
                    <p className="text-muted-foreground text-lg mx-auto mt-4 max-w-md text-balance">
                        Find the perfect membership plan that matches your needs.
                    </p>
                </div>

                <div className="mt-12 flex flex-col gap-6 md:hidden">
                    {plans.map((plan, planIndex) => {
                        const key = planKeys[planIndex]!;
                        return (
                            <Card
                                key={plan.name}
                                className={`overflow-hidden ${plan.highlighted ? 'ring-primary/20 ring-2' : ''}`}
                            >
                                <div
                                    className={`flex flex-col border-b p-4 text-center ${plan.highlighted ? 'bg-primary/5' : ''}`}
                                >
                                    <p className="text-foreground font-medium">
                                        {plan.name}
                                    </p>
                                    <p className="mt-1">
                                        <span className="text-2xl font-medium">
                                            {plan.price}
                                        </span>
                                        <span className="text-muted-foreground text-sm">
                                            {plan.period}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex flex-col divide-y">
                                    {features.map((feature) => {
                                        const value = feature[key];
                                        return (
                                            <div
                                                key={feature.name}
                                                className="flex items-center justify-between gap-4 px-4 py-3 text-lg"
                                            >
                                                <span className="text-muted-foreground">
                                                    {feature.name}
                                                </span>
                                                <div className="flex shrink-0 items-center justify-end">
                                                    <FeatureValue
                                                        value={value}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div
                                    className={`flex flex-col border-t p-4 ${plan.highlighted ? 'bg-primary/5' : ''}`}
                                >
                                    <Button
                                        asChild
                                        variant={
                                            plan.highlighted
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="lg"
                                        className="w-full text-lg"
                                    >
                                        <Link
                                            href={plan.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {plan.cta}
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <Card className="mt-12 hidden *:min-w-2xl overflow-auto md:block">
                    <div className="grid grid-cols-4 border-b">
                        <div className="p-4"></div>
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`border-l p-4  text-center ${plan.highlighted ? 'bg-primary/5' : ''}`}
                            >
                                <p className="text-foreground  font-regular">
                                    {plan.name}
                                </p>
                                <p className="mt-1">
                                    <span className="font-serif text-2xl font-medium">
                                        {plan.price}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                        {plan.period}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                    {features.map((feature) => (
                        <div
                            key={feature.name}
                            className="grid grid-cols-4 border-b last:border-b-0"
                        >
                            <div className="text-muted-foreground p-4 text-lg">
                                {feature.name}
                            </div>
                            {planKeys.map((plan, idx) => {
                                const value = feature[plan];
                                return (
                                    <div
                                        key={plan}
                                        className={`flex items-center justify-center border-l p-4 text-lg ${idx === 1 ? 'bg-primary/5' : ''}`}
                                    >
                                        <FeatureValue value={value} />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div className="grid grid-cols-4 border-t">
                        <div className="p-4"></div>
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`border-l p-4 ${plan.highlighted ? 'bg-primary/5' : ''}`}
                            >
                                <Button
                                    asChild
                                    variant={
                                        plan.highlighted ? 'default' : 'outline'
                                    }
                                    size="lg"
                                    className="w-full"
                                >
                                    <Link
                                        href={plan.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {plan.cta}
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </section>
    );
}
