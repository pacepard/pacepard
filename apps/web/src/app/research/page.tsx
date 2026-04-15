import type { Metadata } from 'next';

import { siteConfig } from '@/_data/site-config';
import ComingSoonPanel from '@/components/shared/coming-soon';

export const metadata: Metadata = {
    title: `Research | ${siteConfig.title}`,
    description:
        'Research hub and resources from Pacepard. This area is coming soon.',
};

export default function ResearchPage() {
    return (
        <div className="py-16 md:py-24">
            <ComingSoonPanel
                title="Research"
                description="We are preparing a space for research notes, initiatives, and public-facing work. Check back soon, or reach out if you would like to collaborate."
                primaryAction={{ label: 'Back to home', href: '/' }}
                secondaryAction={{
                    label: 'Email us',
                    href: siteConfig.links.email,
                    external: true,
                }}
                 imageSrc='/blocks/login.png'
            />
        </div>
    );
}
