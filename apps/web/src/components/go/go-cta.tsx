import { Button } from '@/components/ui/button'
import { ArrowRightToLineIcon, Calendar } from 'lucide-react'
import Link from 'next/link'

const GoCTA = () => {
    return (
        <section>
            <div className="py-24 bg-neutral-50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <h2 className="text-foreground text-balance text-3xl font-semibold lg:text-4xl">Run memorable hackathons</h2>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button
                                asChild
                                variant="outline"
                                className="pl-2.5 h-11">
                                <Link
                                    href="https://calendly.com/pacepard"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <Calendar
                                        className="!size-3.5 opacity-50"
                                        strokeWidth={2.5}
                                    />
                                    Request a demo
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="pr-2 h-11">
                                <Link href="mailto:hello@pacepard.com">
                                    Send us a mail
                                    <ArrowRightToLineIcon
                                        strokeWidth={2.5}
                                        className="size-4"
                                    />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GoCTA;