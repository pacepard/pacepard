import { HeartHandshake, Sparkles, Target, Users } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

const items = [
  {
    id: 1,
    date: "15 minutes ago",
    title: "A Passion to Create",
    description:
      "Whether you’re into design, storytelling, strategy, or tech, come ready to use your gifts for good.",
    icon: Sparkles,
  },
  {
    id: 2,
    date: "10 minutes ago",
    title: "A Heart for Impact",
    description:
      "You believe innovation can be a tool for the Gospel and want to make a difference where it matters most.",
    icon: HeartHandshake,
  },
  {
    id: 3,
    date: "5 minutes ago",
    title: "A Willingness to Collaborate",
    description: "#HACK is all about teamwork. Bring your ideas, energy, and openness to learn.",
    icon: Users,
  },
  {
    id: 4,
    title: "Faith in Action",
    description:
      "This is for Christians who want to use their skills to serve people and transform communities.",
    icon: Target,
  },
]

export default function EntryRequirements() {
  return (
    <>

       <h4 className="text-1xl md:text-[20px] pb-8">
            Joining #HACK2025 is simple; all you need is:
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
          
          <TimelineContent>
            {item.description}
            
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
    </>
  )
}
