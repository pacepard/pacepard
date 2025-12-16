import { useId } from "react";

import { DynamicIcon } from "lucide-react/dynamic";

import { venueItems } from "@/_data/hack/venue-data";
import { Label } from "@/components/ui/label";

export default function VenueDateTime() {
  const baseId = useId();

  return (
    <div className="flex flex-col gap-6">
      {venueItems.map((item) => {
        const id = `${baseId}-${item.id}`;

        return (
          <div key={item.id} className="flex w-full items-center">
            <div className="flex w-full items-center gap-3 rounded-xl border border-brand/60 bg-background/40 p-4 shadow-sm transition-all hover:border-brand">
              
              {/* Icon */}
              <div className="flex items-center justify-center rounded-md bg-brand/10 p-2">
                <DynamicIcon
                  name={item.icon}
                  className="size-5 text-brand"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col text-left">
                <Label
                  htmlFor={id}
                  className="text-base font-semibold text-foreground flex items-center gap-1"
                >
                  {item.label}
                  {item.sublabel && (
                    <span className="text-sm font-normal text-muted-foreground">
                      ({item.sublabel})
                    </span>
                  )}
                </Label>

                <p
                  id={`${id}-description`}
                  className="text-sm md:text-base text-muted-foreground"
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
