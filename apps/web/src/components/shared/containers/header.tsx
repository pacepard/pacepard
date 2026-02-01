"use client";

import React from "react";

import Link from "next/link";

import { Menu, X } from "lucide-react";
import { useScroll } from "motion/react";

import { Navigation } from "@/_data/pacepard/navigation";
import { Logo } from "@/components/shared/containers/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/context/theme-toggle";
import { cn } from '@pacepard/ui/lib/utils';


const PacepardHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed z-20 w-full transition-colors duration-150",
          scrolled && "bg-background/50 backdrop-blur-3xl"
        )}
      >
        <div className="mx-auto max-w-7xl items-center justify-center px-4 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-2 lg:gap-0">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link href="/" aria-label="home" className="flex">
                <Logo />
              </Link>

              <div className="flex items-center space-x-2 lg:hidden">
                <ThemeToggle className="relative z-20 block cursor-pointer hover:bg-accent " />
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="m-auto size-8 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                  <X className="absolute inset-0 m-auto size-8 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
                </button>
              </div>

              {/* Desktop navigation */}
              <div className="hidden lg:block">
                <ul className="flex gap-4 text-sm">
                  {Navigation.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="font-normal hover:text-primary block duration-150"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile + CTA section */}
            <div className="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              {/* Mobile navigation */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {Navigation.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-foreground hover:text-accent-foreground block duration-150"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex w-full items-start sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <div className="lg:flex relative z-20 cursor-pointer hidden">
                  <ThemeToggle />
                </div>

                
                {!scrolled && (
                  <>
                    <Button asChild variant="link" size="sm">
                      <Link href="#">
                        <span className="text-foreground hover:text-accent-foreground">
                          Login
                        </span>
                      </Link>
                    </Button>

                    <Button asChild size="sm">
                      <Link href="#">
                        <span>Register</span>
                      </Link>
                    </Button>
                  </>
                )}

                {scrolled && (
                  <Button asChild size="sm">
                    <Link href="#">
                      <span>Contact Sales</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};


export default PacepardHeader
