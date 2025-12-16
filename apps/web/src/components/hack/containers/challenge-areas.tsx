import { Brain, Globe2, HeartHandshake } from "lucide-react";

import {
  Timeline,
  TimelineContent,
  
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

const items = [
 
  {
    id: 1,

    title: "People on the Move:",
    description:
      "Submitted PR #342 with new feature implementation. Waiting for code review from team leads.",
    icon: Globe2,
  },
  {
    id: 2,
    
    title: "Discipleship in a Digital Age:",
    description:
      "Received comments on PR. Minor adjustments needed in error handling and documentation.",
    icon: Brain,
  },
  {
    id: 3,
    title: "Least Reached People",
    description:
      "Merged the feature branch into the main branch. Ready for deployment.",
    icon: HeartHandshake,
  },
];

export default function ChallengeAreas() {
  return (
    <>
    
       <h4 className="text-1xl md:text-[20px] pb-8">
            We are calling solutions around:
          </h4>
    <Timeline defaultValue={3}>
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:ms-10"
        >
          <TimelineHeader>
            <TimelineSeparator className="!bg-brand group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineTitle className="mt-0.5">{item.title}</TimelineTitle>
            <TimelineIndicator className="flex size-6 items-center justify-center border-none !bg-brand group-data-completed/timeline-item:bg-brand group-data-completed/timeline-item:text-brand group-data-[orientation=vertical]/timeline:-left-7">
              <item.icon size={14} className="text-black" />
            </TimelineIndicator>
          </TimelineHeader>
          
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>

      <h4 className="text-1xl md:text-[18px] pt-8">
            These and more are the key areas around which the #HACK2025 solutions will be built. 
          </h4>

    </>
  );
}
