import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function EnterprisePricing() {
    return (
        <div className="relative ">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mt-8 md:mt-20">
                    <div className="bg-card relative rounded-3xl border shadow-2xl shadow-zinc-950/5">
                        <div className="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
                            <div className="pb-12 text-center md:pb-0 md:pr-12">
                                <h3 className="text-2xl font-regular">
                                Enterprise
                                </h3>
                                <p className="mt-2 text-lg font-regular text-muted-foreground">
                                    For companies and organizations
                                    running regular hackathon events
                                </p>
                                <p className="mt-6 mb-6 text-3xl md:text-4xl font-bold">Custom Pricing</p>

                                <div className="flex justify-center">
                                    <Button
                                        asChild
                                        size="lg">
                                        <Link href="mailto:hello@pacepard.com">
                                            Contact us
                                        </Link>
                                    </Button>
                                </div>

                                <p className="text-muted-foreground mt-12 text-lg md:text-sm">
                                    Includes onboarding, event setup support,
                                    and full platform access for your team.
                                </p>
                            </div>
                            <div className="relative">
                                <ul
                                    role="list"
                                    className="space-y-4">
                                    {[
                                        'Dedicated hackathon workspace and branded experience',
                                        'Tracks, judging criteria, and mentor workflows',
                                        'Team formation, submissions, and live leaderboard',
                                        'Post-event talent pipeline and participant analytics',
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2 text-lg md:text-base">
                                            <Check className="size-3 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted-foreground mt-6 text-lg md:text-sm">
                                    Team size is flexible and can scale from a
                                    single cohort to multi-community events.
                                </p>
                                {/* <div className="**:fill-foreground mt-12 flex flex-wrap items-center gap-12">
                                    <Hulu
                                        height={18}
                                        width={56}
                                    />
                                    <Spotify
                                        height={24}
                                        width={80}
                                    />
                                    <FirebaseFull
                                        height={24}
                                        width={80}
                                    />
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}