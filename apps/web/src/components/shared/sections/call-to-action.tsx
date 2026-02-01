import Link from 'next/link'

import { Calendar, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function CallToAction() {
    return (
        <section>
            <div className="bg-muted py-12">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="text-foreground max-w-lg text-balance text-3xl font-semibold lg:text-4xl">
                        <span className="text-muted-foreground">The world's best got </span> better by doing.
                    </h2>
                    <p className="mt-4 text-lg">Join open hackathons, co-create with global companies, or host your own innovation challenges.</p>
                    <div className="mt-8 flex gap-3">
                        <Button
                            asChild
                            className="pr-2">
                            <Link href="#">
                                Try Pacepard for Free
                                <ChevronRight
                                    strokeWidth={2.5}
                                    className="size-3.5! opacity-50"
                                />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="pl-2.5">
                            <Link href="https://calendly.com/pacepard"
                                target="_blank"
                                rel="noopener noreferrer">
                                <Calendar
                                    className="!size-3.5 opacity-50"
                                    strokeWidth={2.5}
                                />
                                Request a Demo
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}