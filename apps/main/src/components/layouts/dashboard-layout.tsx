import React, { useContext } from 'react';
import { storage, UserContext } from '@pacepard/sdk';
import { SidebarProvider } from '@pacepard/ui/components/sidebar';
import AppSidebar from '../blocks/navigation/side-nav';
import TopBar from '../blocks/navigation/TopBar';
import { Toaster } from '@pacepard/ui/components/sonner';
import { cn } from '@pacepard/ui/lib/utils';

interface DashboardLayoutProps {
    component: React.ReactElement;
    title?: string;
    back?: boolean;
    sidebar?: {
        collapsed?: boolean;
    };
}

const DashboardContent = ({
    component,
    title,
    back,
    sidebar,
}: DashboardLayoutProps) => {
    const userContext = useContext(UserContext);
    const { sidebar: sidebarState } = userContext || {};
    const isCollapsed = sidebarState?.collapsed || false;

    const mainClasses = cn(
        'dashboard-body min-h-screen flex flex-col flex-1',
        //isCollapsed ? 'pl-20' : 'pl-64'
    );

    const wrapperClasses = 'mt-0 px-8 py-6 ';

    return (
        <main id="dashboard-body" className={mainClasses}>
            <TopBar pageTitle={title} showBack={back} sticky={true} />

            <div className="dashboard-content w-full flex-1 overflow-auto">
                <div className={wrapperClasses}>{component}</div>
            </div>
        </main>
    );
};

const DashboardLayout = ({
    component,
    title,
    back = false,
    sidebar,
}: DashboardLayoutProps) => {
    const [defaultOpen] = React.useState(() => {
        const stored = storage.fetch('sidebar-collapsed');
        return stored ? stored !== 'true' : !sidebar?.collapsed;
    });

    return (
        <>
            <SidebarProvider defaultOpen={defaultOpen}>
                <div className="flex h-screen w-full">
                    <AppSidebar />
                    <DashboardContent
                        component={component}
                        title={title}
                        back={back}
                        sidebar={sidebar}
                    />
                </div>
            </SidebarProvider>
            <Toaster />
        </>
    );
};

export default DashboardLayout;
