"use client";
import { useRef, useState } from "react";

import { AlignJustify, X } from "lucide-react";
import { Drawer } from "vaul";

import { TimelineContent } from "@/components/ui/timeline-animation";
import VerticalBarsNoise from "@/components/ui/vertical-bars";
import VerticalCutReveal from "@/components/ui/vertical-cut-reveal";
import { useMediaQuery } from "@/hooks/use-media-query";


function WorkflowAutomationHero() {
  const isMobile = useMediaQuery("(max-width: 992px)");
  const [isOpen, setIsOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <section className="bg-white relative pb-10" ref={heroRef}>
      <div className="absolute bottom-0 left-0 -inset-0 right-0 opacity-65 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
        <VerticalBarsNoise />
      </div>

      <TimelineContent
        as="header"
        animationNum={0}
        timelineRef={heroRef}
        customVariants={revealVariants}
        className="flex gap-2 z-50 text-neutral-900 backdrop-blur-lg rounded-lg max-w-4xl items-center justify-between mx-auto p-2 sticky top-1.5"
      >
        {!isMobile ? (
          <>
            <h1 className="text-xl uppercase">Logo</h1>
            <nav className="flex gap-4 font-medium">
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Solutions</a>
              <a href="#">Resources</a>
              <a href="#">Blog</a>
            </nav>
            <button className="text-lg h-10 px-4 rounded-lg text-white flex items-center gap-2 bg-neutral-800 relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-2 before:bg-gradient-to-t before:from-neutral-800 before:to-neutral-300 before:rounded-t-lg  transition-all group">
              Log In
            </button>
          </>
        ) : (
          <Drawer.Root direction="left" open={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Trigger className="px-2 text-black h-9 grid place-content-center bg-neutral-300 w-fit rounded-lg">
              <AlignJustify />
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
              <Drawer.Content
                className="left-2 top-2 bottom-2 fixed z-50 outline-none w-72 flex"
                style={
                  {
                    "--initial-transform": "calc(100% + 8px)",
                  } as React.CSSProperties
                }
              >
                <div className="bg-gradient-to-t from-neutral-500 via-neutral-300 to-neutral-400 border border-neutral-400 text-white p-2 h-full w-full grow flex flex-col rounded-[16px]">
                  <div className="w-full flex justify-between">
                    <div className="flex gap-2 px-4 flex-shrink-0 items-center text-2xl font-semibold  ">
                      <span>LOGO</span>
                    </div>
                    <button
                      className="rounded-md w-fit bg-neutral-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <X />
                    </button>
                  </div>
                  <div className="rounded-b-md py-2 px-3">
                    <ul className="space-y-2">
                      <li className="hover:bg-neutral-800 cursor-pointer p-1.5 px-2 rounded-md">
                        Features
                      </li>
                      <li className="hover:bg-neutral-800 cursor-pointer p-1.5 px-2 rounded-md">
                        Pricing
                      </li>
                      <li className="hover:bg-neutral-800 cursor-pointer p-1.5 px-2 rounded-md">
                        Solutions
                      </li>
                      <li className="hover:bg-neutral-800 cursor-pointer p-1.5 px-2 rounded-md">
                        Resources
                      </li>
                      <li className="hover:bg-neutral-800 cursor-pointer p-1.5 px-2 rounded-md">
                        Blog
                      </li>
                    </ul>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}
      </TimelineContent>

      <article className="text-neutral-800 py-32 w-fit max-w-4xl mx-auto text-center space-y-4 relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl capitalize font-medium leading-[120%]">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            containerClassName="justify-center"
            reverse={true}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0.4,
            }}
          >
            Workflow Automation for growing teams
          </VerticalCutReveal>
        </h1>

        <TimelineContent
          as="p"
          animationNum={1}
          timelineRef={heroRef}
          customVariants={revealVariants}
          className="max-w-xl mx-auto text-sm sm:text-base"
        >
          Our Sass integrates your favorite tools into one simple dashboard, so
          you can focus on what truly matters: building, collaborating, and
          delivering results.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={2}
          timelineRef={heroRef}
          customVariants={revealVariants}
          className="flex gap-2 mt-5 mx-auto w-fit"
        >
          <button className="text-lg h-12 px-4 rounded-lg text-white flex items-center gap-2 bg-neutral-800 relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-2 before:bg-gradient-to-t before:from-neutral-800 before:to-neutral-300 before:rounded-t-lg  transition-all group">
            Get Started For Free
          </button>
        </TimelineContent>
      </article>

      <TimelineContent
        as="figure"
        animationNum={3}
        timelineRef={heroRef}
        customVariants={revealVariants}
        className="relative max-w-6xl mx-auto p-3 backdrop-blur-lg bg-black/5 rounded-lg"
      >
        <img
          src="./dashboard.png"
          alt="dashboardimg"
          className="w-full relative z-10 rounded-lg"
        />
      </TimelineContent>
    </section>
  );
}

export default WorkflowAutomationHero;
