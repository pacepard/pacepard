import Link from 'next/link';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

export default function ClPricing() {
    return (
        <div className="bg-muted relative py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Pricing
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-lg">
                        {' '}
                        Start using Pacepard for free. Upgrade to unlock
                        personalised perks,and additional features.
                    </p>
                </div>
                <div className="@container relative mt-12 md:mt-20">
                    <Card className="@4xl:max-w-full relative mx-auto max-w-sm">
                        <div className="@4xl:grid-cols-3 grid">
                            <div>
                                <CardHeader className="p-8">
                                    <CardTitle className="font-medium">
                                        Free
                                    </CardTitle>
                                    <span className="mb-0.5 mt-2 block text-2xl font-semibold">
                                        ₦0 / monthly
                                    </span>
                                    <CardDescription className="text-sm">
                                        Free for everyone
                                    </CardDescription>
                                </CardHeader>
                                <div className="border-y px-8 py-4">
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant="default"
                                    >
                                        <Link href="/join-pacepard">
                                            Select Plan
                                        </Link>
                                    </Button>
                                </div>

                                <ul className="space-y-3 p-8">
                                    {[
                                        'Learning challenges and projects',
                                        'Beginner-friendly tasks',
                                        'Community-based Q&A',
                                        'Monthly live sessions',
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <Check
                                                className="text-primary size-3"
                                                strokeWidth={3.5}
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="ring-foreground/10 bg-background rounded-(--radius) @3xl:mx-0 @3xl:-my-3 -mx-1 border-transparent shadow ring-1">
                                <div className="@3xl:py-3 @3xl:px-0 relative px-1">
                                    <CardHeader className="p-8">
                                        <CardTitle className="font-medium">
                                            Starter
                                        </CardTitle>
                                        <span className="mb-0.5 mt-2 block text-2xl font-semibold">
                                            ₦19,900 / monthly
                                        </span>
                                        <CardDescription className="text-sm">
                                            For Professionals
                                        </CardDescription>
                                    </CardHeader>
                                    <div className="@3xl:mx-0 -mx-1 border-y px-8 py-4">
                                        <Button asChild className="w-full">
                                            <Link href="https://paystack.shop/pay/buysr6duuf">
                                                Select Plan
                                            </Link>
                                        </Button>
                                    </div>

                                    <ul className="space-y-3 p-8">
                                        {[
                                            'Everything in Free and...',
                                            'Intermediate tasks',
                                            'AI-Assisted learning',
                                            'Work side-by-side a team',
                                            'Starter templates and packs',
                                            'Weekly live sessions',
                                            'Certifications & Badges',
                                        ].map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2"
                                            >
                                                <Check
                                                    className="text-primary size-3"
                                                    strokeWidth={3.5}
                                                />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <CardHeader className="p-8">
                                    <CardTitle className="font-medium">
                                        Builders
                                    </CardTitle>
                                    <span className="mb-0.5 mt-2 block text-2xl font-semibold">
                                        ₦59,900 / monthly
                                    </span>
                                    <CardDescription className="text-sm">
                                        For Builders
                                    </CardDescription>
                                </CardHeader>
                                <div className="border-y px-8 py-4">
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant="default"
                                    >
                                        <Link href="https://paystack.shop/pay/dkqlreiobj">
                                            Select Plan
                                        </Link>
                                    </Button>
                                </div>

                                <ul className="space-y-3 p-8">
                                    {[
                                        'Everything in Starter and...',
                                        '1 on 1  mentor pairing & reviews',
                                        'Priority support',
                                        'Pacepard talent pool',
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <Check
                                                className="text-primary size-3"
                                                strokeWidth={3.5}
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* <div>
                                <CardHeader className="p-8">
                                    <CardTitle className="font-medium">Enterprise</CardTitle>
                                    <span className="mb-0.5 mt-2 block text-2xl font-semibold">billed annually</span>
                                    <CardDescription className="text-sm">For teams and Organisations</CardDescription>
                                </CardHeader>
                                <div className="border-y px-8 py-4">
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant="default">
                                        <Link href="#">Contact Sales</Link>
                                    </Button>
                                </div>

                                <ul
                                    className="space-y-3 p-8">
                                    {[
                                        "Everything in Starter and...",
                                        "1 on 1  mentor pairing & reviews",
                                        "Priority support",
                                        "Pacepard talent pool",
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2">
                                            <Check
                                                className="text-primary size-3"
                                                strokeWidth={3.5}
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div> */}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
