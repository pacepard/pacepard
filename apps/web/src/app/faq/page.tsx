import React from "react";

import { Background } from "@/components/background";
import { DashedLine } from "@/components/dashed-line";
import { FAQ } from "@/components/pacepard/sections/faq";
import { Testimonials } from "@/components/pacepard/sections/testimonials";

const Page = () => {
  return (
    <Background>
      <FAQ
        className="py-28 text-center lg:pt-44 lg:pb-32"
        className2="max-w-xl lg:grid-cols-1"
        headerTag="h1"
      />
      <DashedLine className="mx-auto max-w-xl" />
      <Testimonials dashedLineClassName="hidden" />
    </Background>
  );
};

export default Page;
