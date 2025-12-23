import { type Icon } from '@phosphor-icons/react';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@pacepard/ui/components/sidebar';

export function NavGenerics({
    projects,
}: {
    projects: {
        name: string;
        url: string;
        icon: Icon;
    }[];
}) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden -mt-2 pt-0">
            <SidebarMenu className="-gap-2">
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name} className=''>
                        <SidebarMenuButton asChild >
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
