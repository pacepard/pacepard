import Link from "next/link";

import { AboutUsData } from "@/_data/hack/about-us";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";

export default function AboutUs() {
  return (
    <section className="bg-neutral-900 text-white py-16 pt-20 md:py-32 dark:bg-neutral-900">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <img
          className="rounded-(--radius) grayscale"
          src={AboutUsData.image.src}
          alt={AboutUsData.image.alt}
          height={AboutUsData.image.height}
          width={AboutUsData.image.width}
          loading="lazy"
        />

        {/* This is the main flex container for the heading and subheading */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start md:gap-x-12">
          {/* Heading Section */}
          <div className="flex-1 items-start">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="mt-6 max-w-2xl text-4xl md:text-5xl font-medium text-left"
            >
              {AboutUsData.heading}
            </TextEffect>
          </div>

          {/* Subheading and Button Section */}
          <div className="flex-1 flex flex-col space-y-6">
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mt-8 max-w-2xl text-lg text-pretty text-left"
            >
              {AboutUsData.subheading}
            </TextEffect>

            <div className="flex flex-1">
              <div className="group rounded-[calc(var(--radius-sm)+0.125rem)]">
                <Button
                  asChild
                  size="lg"
                  className="rounded-md px-5 text-black bg-brand hover:bg-brand/90"
                >
                  <Link href={AboutUsData.button.href}>
                    <span className="text-nowrap">{AboutUsData.button.text}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
