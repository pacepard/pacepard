import { Background } from "@/components/background";
import { DashedLine } from "@/components/dashed-line";
import MentorSection from "@/components/hack/sections/mentors";
import About from "@/components/pacepard/containers/about";
import { AboutHero } from "@/components/pacepard/containers/about-hero";

export default function AboutPage() {
  return (
    <Background>
      <div className="py-28 lg:py-32 lg:pt-44">
        <AboutHero />

        <About />
        <div className="pt-28 lg:pt-32">
          <DashedLine className="container max-w-5xl scale-x-115" />
          {/* <Investors /> */}
          <MentorSection/>
        </div>
      </div>
    </Background>
  );
}
