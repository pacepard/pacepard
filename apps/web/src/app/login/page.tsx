import type { Metadata } from 'next';

import { siteConfig } from '@/_data/site-config';
import ComingSoonPanel from '@/components/shared/coming-soon';

export const metadata: Metadata = {
    title: `Sign in | ${siteConfig.title}`,
    description: 'Web sign-in for Pacepard is coming soon.',
};

export default function LoginPage() {
    return (
        <div className="py-16 md:py-24">
            <ComingSoonPanel
                title="Sign in"
                description="The web sign-in experience is still in progress.  We will be launching soon. You can return to the homepage." // its a new platform now
                primaryAction={{
                    label: 'Open app',
                    href: siteConfig.getStartedUrl,
                    external: true,
                }}
                secondaryAction={{ label: 'Back to home', href: '/' }}
               
            />
        </div>
    );
}
