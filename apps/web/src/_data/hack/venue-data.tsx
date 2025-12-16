import { IconName } from "lucide-react/dynamic";

export type VenueItem = {
  id: string;
  icon: IconName;
  label: string;
  sublabel?: string;
  description: string;
};

export const venueItems: VenueItem[] = [
  {
    id: "venue",
    label: "Venue",
    
    description: "The Assembly by Ennovate Lab, beside BON Nest Hotel, along LAUTECH Main Gate, Ogbomoso, Oyo State",
    icon: "map-pin",
  },
  {
    id: "date",
    label: "Date",
    //sublabel: "Schedule",
    description: "23rd – 25th October, 2025",
    icon: "calendar",
  },
  
  {
    id: "time",
    label: "Time",
    
    description: "09:00 AM daily",
    icon: "clock",
  },
];
