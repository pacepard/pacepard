import { storage, UserType } from '@pacepard/sdk';
import { SidebarProvider } from '@pacepard/ui/components/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '../blocks/navigation/side-nav';
import NavBar from '../blocks/navigation/NavBar';
import { Separator } from '@pacepard/ui/components/separator';

const DashboardLayout = () => {
    const [defaultOpen] = React.useState(() => {
        const stored = storage.fetch('sidebar-collapsed');
        return stored ? stored !== 'true' : true;
    });

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <div className="flex h-screen w-full">
                <AppSidebar userRole={UserType.TALENT} />

                <div className="flex flex-col flex-1">
                    <NavBar />
                    <main className="flex-1 m-3 pl-6 pt-2 pr-6 bg-neutral-100/60 dark:bg-neutral-900/60 rounded-md overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
