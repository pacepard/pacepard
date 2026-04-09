import ComingSoonPanel from '@/components/shared/coming-soon';

/**
 * Marketing “full launch” variant: countdown + default headline.
 * Prefer importing {@link ComingSoonPanel} for route-specific /login or /research pages.
 */
export default function ComingSoon() {
    return (
        <ComingSoonPanel
            title="One workspace, one goal. Get consistent desired results."
            description="Pacepard is where talents learn and grow by doing, and organisations drive long-term product adoption, engagement and loyalty."
            showCountdown
            primaryAction={{ label: 'Notify me', href: 'mailto:hello@pacepard.com' }}
            secondaryAction={{ label: 'Request a demo', href: 'https://calendly.com/pacepard', external: true }}
        />
    );
}
