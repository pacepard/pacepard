import React, { useContext } from 'react';
import { storage, UserContext } from '@pacepard/sdk';
import { Toaster } from '@pacepard/ui/components/sonner';
import { cn } from '@pacepard/ui/lib/utils';
import EditorHeader from '../blocks/editor/header';

interface IEditorLayout {
    component: React.ReactElement;
    title?: string;
    back?: boolean;
    sidebar?: {
        collapsed?: boolean;
    };
}

const EditorContent = ({ component, title, back, sidebar }: IEditorLayout) => {
    const userContext = useContext(UserContext);
    const { sidebar: sidebarState } = userContext || {};

    const mainClasses = cn(
        'dashboard-body min-h-screen flex flex-col flex-1 bg-background text-foreground'
    );

    const wrapperClasses = 'mt-0 px-8 py-6 ';

    return (
        <main id="dashboard-body" className={mainClasses}>
            <EditorHeader pageTitle={title} showBack={back} sticky={true} />

            <div className="dashboard-content w-full flex-1 overflow-auto">
                <div className={wrapperClasses}>{component}</div>
            </div>
        </main>
    );
};

const EditorLayout = (data: IEditorLayout) => {
    const { component, title, back = false, sidebar } = data;

    return (
        <>
                <div className="flex h-screen w-full bg-background text-foreground">
                    <EditorContent
                        component={component}
                        title={title}
                        back={back}
                        sidebar={sidebar}
                    />
                </div>
            <Toaster />
        </>
    );
};

export default EditorLayout;


// hacakthon page = 
    // analytics, entries, submissions, settings, etc.
    // the sidebar should be visible and collapsible

// hackathon eidt page = 
    // publish, draft, preview, delete, copy etc.
    // share, invite team, version history
    // Flow (list of forms)
    // the sidebar should be be hidden


// editor page for the connected forms=
    // back button
    // save, draft, preview, delete, copy, etc.
    // the sidebar should be hidden