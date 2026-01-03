import {
    CaretDown,
    DotsThreeIcon,
    Folder,
    ShareNetwork,
    Trash,
    type Icon,
} from '@phosphor-icons/react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@pacepard/ui/components/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@pacepard/ui/components/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@pacepard/ui/components/sidebar';

type WorkspaceItem = {
    name: string;
    url: string;
    icon: Icon;
};

type WorkspaceSection = {
    label: string;
    items: WorkspaceItem[];
};

export function NavWorkspaces({ sections }: { sections: WorkspaceSection[] }) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-md text-muted-foreground">
                workspaces
            </SidebarGroupLabel>
            <SidebarMenu>
                {sections.map((section) => (
                    <Collapsible
                        asChild
                        key={section.label}
                        defaultOpen
                        className="group/collapsible"
                    >
                        <SidebarMenuItem className="group/workspace">
                            <div className="group/workspace-button">
                                <SidebarMenuButton
                                    className="relative"
                                    tooltip={section.label}
                                >
                                    <CollapsibleTrigger asChild>
                                        <button
                                            className="flex items-center justify-center p-0 outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                                            aria-label={`Toggle ${section.label}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <CaretDown className="size-4 transition-transform duration-200 -rotate-90 group-data-[state=open]/collapsible:rotate-0" />
                                        </button>
                                    </CollapsibleTrigger>
                                    <span>{section.label}</span>
                                </SidebarMenuButton>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuAction className="peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/workspace-button:opacity-100 group-hover/workspace-button:opacity-100 data-[state=open]:opacity-100 md:opacity-0">
                                            <DotsThreeIcon />
                                            <span className="sr-only">
                                                More
                                            </span>
                                        </SidebarMenuAction>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-48"
                                        side={isMobile ? 'bottom' : 'right'}
                                        align={isMobile ? 'end' : 'start'}
                                    >
                                        <DropdownMenuItem>
                                            <Folder className="text-muted-foreground" />
                                            <span>View</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <ShareNetwork className="text-muted-foreground" />
                                            <span>Share</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Trash className="text-muted-foreground" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CollapsibleContent>
                                <SidebarMenuSub className="border-l-0">
                                    {section.items.map((item) => (
                                        <SidebarMenuSubItem
                                            key={item.name}
                                            className="ml-2 group/item"
                                        >
                                            <SidebarMenuSubButton asChild>
                                                <a href={item.url}>
                                                    <span className="text-md font-regular">
                                                        {item.name}
                                                    </span>
                                                </a>
                                            </SidebarMenuSubButton>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <SidebarMenuAction className="peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/item:opacity-100 group-hover/item:opacity-100 data-[state=open]:opacity-100 md:opacity-0">
                                                        <DotsThreeIcon />
                                                        <span className="sr-only">
                                                            More
                                                        </span>
                                                    </SidebarMenuAction>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    className="w-48"
                                                    side={
                                                        isMobile
                                                            ? 'bottom'
                                                            : 'right'
                                                    }
                                                    align={
                                                        isMobile
                                                            ? 'end'
                                                            : 'start'
                                                    }
                                                >
                                                    <DropdownMenuItem>
                                                        <Folder className="text-muted-foreground" />
                                                        <span>View</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <ShareNetwork className="text-muted-foreground" />
                                                        <span>Share</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Trash className="text-muted-foreground" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
