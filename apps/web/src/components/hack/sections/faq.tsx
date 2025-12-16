'use client'

import Link from 'next/link'

import { DynamicIcon } from 'lucide-react/dynamic'

import { hackFaqItems, hackFaqSection } from '@/_data/hack/fag-items'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'


export default function FAQ() {
  return (
    <section className="bg-amber-100 py-16 pt-20 md:py-32 dark:bg-[#171717]">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          {/* Left Section */}
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-3xl font-bold">{hackFaqSection.title}</h2>
              <p className="text-muted-foreground mt-4">
                {hackFaqSection.description}{' '}
                <br/>
                <Link
                  href={hackFaqSection.contactLink}
                  className="text-black dark:text-brand font-medium hover:underline"
                >
                  {hackFaqSection.contactText}
                </Link>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {hackFaqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background shadow-xs rounded-lg border px-4 last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon name={item.icon} className="m-auto size-4" />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
