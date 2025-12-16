import Link from "next/link"

import VenueDateTime from "@/components/hack/containers/venue"
import { Button } from "@/components/ui/button"
import { TextEffect } from "@/components/ui/text-effect"

export default function Location() {
  return (
    <section className="bg-amber-100 dark:bg-neutral-900 py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-20">
        
        {/* Left Section — Text + Button */}
        <div className="flex-1 w-full text-left">
          <TextEffect
            per="line"
            preset="fade-in-blur"
            speedSegment={0.3}
            delay={0.5}
            as="p"
            className="text-lg md:text-xl max-w-xl leading-relaxed"
          >
            {"These and more are the key areas around which the #HACK2025 solutions will be built. "}
          </TextEffect>

          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-md px-6 py-3 bg-brand text-black hover:bg-brand/90 transition-all"
            >
              <Link href="#link">
                <span className="whitespace-nowrap">About Ennovate Lab</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Section — Venue + DateTime */}
        <div className="flex-1 w-full md:text-right">
          <VenueDateTime />
        </div>
      </div>
    </section>
  )
}


{/* <div className="mx-auto max-w-5xl px-6">

                <div className="text-center">
                    <h2 className="text-title text-balance text-4xl font-semibold lg:text-5xl">Start Building</h2>
                    <p className="text-body mt-4">Libero sapiente aliquam quibusdam aspernatur.</p>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
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
            </div> */}