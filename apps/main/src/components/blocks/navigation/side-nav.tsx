import React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@pacepard/ui/components/sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Separator } from '@pacepard/ui/components/separator';
import type { UserType } from '@pacepard/sdk';
import { navItems } from '@/_data/nava-data';
import { NavUser } from '@/components/blocks/navigation/nav-user';
import { NavWorkspaces } from './nav-workspaces';
import { Folder, FolderIcon } from '@phosphor-icons/react';
import { NavProducts } from './nav-products';
import { NavGenerics } from './nav-generics';
import { NavHelp } from './nav-help';

interface ISideBar {
    userRole: UserType;
    props?: React.ComponentProps<typeof Sidebar>;
}

const AppSidebar = (data: ISideBar) => {
    const { userRole, ...props } = data;
    const location = useLocation();
    const currentPath = location.pathname;

    const user = {
        firstName: 'Damola',
        lastName: 'Oladipo',
        // email: 'damola@gmail.com',
        avatar: '/blocks/pacepard-icon.svg',
    };

    // TODO: Import navItems from _data/navdata when available
    //const items: any[] = [];
    const items = [...navItems.mainNav, ...navItems.hackSpace];

    const visibleItem = items.filter((group: any) =>
        group.roles.includes(userRole),
    );

    return (
        <Sidebar collapsible="icon" className="overflow-hidden " {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center">
                            <NavUser user={user} />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavGenerics
                    projects={[
                        {
                            name: 'Home',
                            url: '/home',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                        {
                            name: 'Search',
                            url: '/search',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                        {
                            name: 'My-Inbox',
                            url: '/messages',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                        {
                            name: 'Domains',
                            url: '/domains',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                        {
                            name: 'Upgrade Plan',
                            url: '/upgrade-plan',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                    ]}
                />

                {/** Example projects array, can be replaced by real data later */}
                <NavWorkspaces
                    sections={[
                        {
                            label: 'My projects',
                            items: [
                                {
                                    name: 'Alpha',
                                    url: '/projects/alpha',
                                    icon: Folder,
                                },
                                {
                                    name: 'Beta',
                                    url: '/projects/beta',
                                    icon: Folder,
                                },
                            ],
                        },
                        {
                            label: 'My hackathons',
                            items: [
                                {
                                    name: 'Hack Lagos',
                                    url: '/hackathons/lagos',
                                    icon: Folder,
                                },
                                {
                                    name: 'Hack Abuja',
                                    url: '/hackathons/abuja',
                                    icon: Folder,
                                },
                            ],
                        },
                    ]}
                />

                <NavProducts
                    products={[
                        {
                            name: 'Project Forge',
                            url: '/projects/forge',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                        {
                            name: 'Project Beta',
                            url: '/projects/beta',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                        {
                            name: 'Project Beta',
                            url: '/projects/beta',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                    ]}
                />

                <NavHelp
                    projects={[
                        {
                            name: 'Help 1',
                            url: '/projects/help1',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                        {
                            name: 'Help 2',
                            url: '/projects/help2',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                        {
                            name: 'Help 3',
                            url: '/projects/help3',
                            icon: FolderIcon, // Replace with actual icon component or import
                        },
                    ]}
                />
            </SidebarContent>

            <SidebarFooter></SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;
