'use client';

import * as React from 'react';

import { cn } from '@pacepard/ui/lib/utils';

import { PacepardIconLoader } from './pacepard-icon-loader';

/**
 * Full-viewport splash until the document has finished loading resources
 * (`load`) and webfonts are ready. Root layout wraps main UI so first paint
 * is the branded loader, then content fades in.
 */
export function InitialLoadGate({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = React.useState(true);

    React.useEffect(() => {
        let cancelled = false;

        const reveal = () => {
            if (!cancelled) setShowSplash(false);
        };

        const waitForFullLoad = async () => {
            const fontsReady = document.fonts.ready.catch(() => undefined);
            const windowLoaded =
                document.readyState === 'complete'
                    ? Promise.resolve()
                    : new Promise<void>((resolve) => {
                          window.addEventListener(
                              'load',
                              () => resolve(),
                              { once: true },
                          );
                      });

            await Promise.all([fontsReady, windowLoaded]);
            if (!cancelled) reveal();
        };

        void waitForFullLoad();

        return () => {
            cancelled = true;
        };
    }, []);

    React.useEffect(() => {
        if (showSplash) {
            document.body.style.overflow = 'hidden';
            document.body.style.backgroundColor = '#ffffff';
        } else {
            document.body.style.overflow = '';
            document.body.style.backgroundColor = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.backgroundColor = '';
        };
    }, [showSplash]);

    return (
        <>
            <div
                className={cn(
                    'fixed inset-0 z-[200000] flex items-center justify-center bg-white transition-opacity duration-300 ease-out motion-reduce:transition-none',
                    showSplash
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0',
                )}
                aria-hidden={!showSplash}
            >
                <PacepardIconLoader size={64} label="Loading site" />
            </div>
            <div
                className={showSplash ? 'min-h-screen bg-white' : undefined}
                aria-hidden={showSplash}
            >
                {children}
            </div>
        </>
    );
}
