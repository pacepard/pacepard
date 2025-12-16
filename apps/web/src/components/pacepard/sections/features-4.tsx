import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap, LucideIcon, ArrowUpRight } from 'lucide-react'

import { FEATURES_HEADER, FEATURES_GRID } from "@/_data/pacepard/features"; 
import { Button } from '@/components/ui/button'

// 1. Create a map to link string keys from the data file to the actual Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
    Zap,
    Cpu,
    Fingerprint,
    Pencil,
    Settings2,
    Sparkles,
};

export default function Features() {
    const header = FEATURES_HEADER;
    const grid = FEATURES_GRID;

    return (
        <section className="py-12 md:py-20 px-4">
            <div className="mx-auto max-w-5xl space-y-8 md:space-y-16">

                  {/* Header Section (uses FEATURES_HEADER) */}
                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-medium">{header.title}</h2>
                    <div className="space-y-6">
                        <p>{header.description}</p>

                        
            <div className="flex flex-1">
              <div className="group rounded-[calc(var(--radius-sm)+0.125rem)]">
                <Button
                  asChild
                  size="default"
                  variant="default"
                  className="relative flex h-11 flex-1 items-center justify-center overflow-hidden rounded-sm px-5 text-base transition-colors duration-300 hover:text-white"
                >
                  <a href={header.button.href}>
                    <span className="relative z-10 flex items-center gap-3 text-nowrap transition-all duration-300 group-hover:translate-x-1">
                      {header.button.text}
                      <ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                    <div className="absolute inset-y-0 left-0 h-full w-full -translate-x-full transition-transform duration-300 group-hover:translate-x-0  bg-gradient-to-r from-[var(--color-green)] to-[var(--color-orange)]"></div>
                  </a>
                </Button>
              </div>
            </div>
                    
                       
                    </div>
                </div>

                {/* Features Grid (maps over FEATURES_GRID) */}
                <div className="relative mx-auto grid max-w-5xl divide-x divide-y border *:p-8 sm:grid-cols-2 lg:grid-cols-3">
                    {grid.map((feature) => {
                        const IconComponent = ICON_MAP[feature.iconKey];
                        if (!IconComponent) return null;

                        return (
                            <div key={feature.title} className="space-y-3">
                                <div className="flex items-center gap-2">
                                    {/* Render the icon component */}
                                    <IconComponent className="size-4" />
                                    <h3 className="text-sm font-medium">{feature.title}</h3>
                                </div>
                                <p className="text-sm">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}
