import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function CallToAction(){
    return (
        <section className="bg-black text-white py-20">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-title text-balance text-4xl font-semibold lg:text-5xl">Start Building</h2>
                    <p className="text-body mt-4">Libero sapiente aliquam quibusdam aspernatur.</p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                         <div
                            key={1}
                            className=" rounded-md p-0.5">
                            <Button
                                asChild
                                size="lg"
                                className="rounded-md px-5 text-black bg-brand hover:bg-brand/90">
                                <Link href={"/"}>
                                    <span className="text-nowrap">{"button"}</span>
                                </Link>
                            </Button>
                        </div>
                        <Button
                            key={2}
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-10.5 rounded-md px-5 border-brand bg-background dark:bg-white text-black">
                            <Link href="#link">
                                <span className="text-nowrap">Become a mentor</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}