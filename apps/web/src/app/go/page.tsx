import { Background } from '@/components/background';
import ClFeatures from '@/components/collective/cl-features';
import GoHero from '@/components/go/go-hero';
import CallToAction from '@/components/shared/sections/call-to-action';
import Features from '@/components/shared/sections/features-4';
import HeroSection from '@/components/shared/sections/hero-section';
import LensShowcase from '@/components/shared/sections/lens-showcase';
import { PersonasShowcase } from '@/components/shared/sections/persona-showcase';
import Pricing from '@/components/shared/sections/pricing';
import { ResourceAllocation } from '@/components/shared/sections/resource-allocation';
import { Testimonials } from '@/components/shared/sections/testimonials';

const Go = () => {
    return (
        <>
            <GoHero />

            <Background>
                <ClFeatures />
                <ResourceAllocation />
            </Background>
        </>
    );
};

export default Go;
