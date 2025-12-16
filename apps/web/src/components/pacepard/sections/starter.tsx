"use client"

import React, { useEffect } from "react";

import Script from "next/script";

import { DashedLine } from "@/components/dashed-line";


export default function Starter() {
  
  
  useEffect(() => {
    if (window.Tally) {
      window.Tally.loadEmbeds();
    }
  }, []);
  

  return (

    <>
      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive"
        onLoad={() => window.Tally?.loadEmbeds()}
      />

      <section className="py-28 lg:py-32 lg:pt-44">
        <div className="container max-w-2xl">
          <h1 className="text-center text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Thank you for choosing the Starter Plan
          </h1>
          <p className="text-muted-foreground mt-4 text-center leading-snug font-medium lg:mx-auto">
            Hopefully this form gets through our spam filters.
          </p>

        

          <DashedLine className="my-12" />

          {/* Inquiry Form */}
          <div className="mx-auto">
            <h2 className="mb-4 text-lg font-semibold">Inquiries</h2>
            <div className="w-full h-screen">
              <iframe
                data-tally-src="https://tally.so/embed/LZ9Zdz?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1"
                loading="lazy"
                className="w-full h-full"
                title="Pacepard Tally Form"
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      </section>


    </>

  );
}
