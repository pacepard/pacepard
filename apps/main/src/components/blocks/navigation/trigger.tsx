import { SidebarTrigger, useSidebar } from "@pacepard/ui/components/sidebar";
import { storage } from "@pacepard/sdk";

import React from "react";

const Trigger = () => {
    const { open, setOpen } = useSidebar();
  
    React.useEffect(() => {
      storage.keep("sidebar-collapsed", String(!open));
    }, [open]);
  
    return <SidebarTrigger  onClick={() => setOpen(!open)} />;
  };

  export default Trigger