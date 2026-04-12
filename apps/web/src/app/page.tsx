import { Background } from '@/components/background';
import PPHeroSection from '@/components/pacepard/pp-hero';
import { PPPersona } from '@/components/pacepard/pp-persona';

import PPGo from '@/components/pacepard/pp-go';
import PPCollective from '@/components/pacepard/pp-collective';
import PPCTA from '@/components/pacepard/pp-cta';
import PPDivider from '@/components/pacepard/pp-divider';

import ClTestimonials from '@/components/collective/cl-testimonials';
import PPFeatureShowcase from '@/components/pacepard/pp-feature-showcase';
import Testimonials from '@/components/pacepard/testimonials';
import PPApprenticeship from '@/components/pacepard/pp-apprenticship';

export default function Home() {
    return (
        <>
            <PPHeroSection />

            {/* <PPPersona /> */}
            <Testimonials />
            {/* <Background> */}
            <PPApprenticeship />
            {/* <PPCollective /> */}

            <ClTestimonials />

            {/* <PPDivider /> */}

            <PPFeatureShowcase />

            {/* <PPGo /> */}
            {/* <Testimonials dashedLineClassName="hidden" /> */}

            <PPCTA />

            {/* <PPTestimonials /> */}
            {/* </Background> */}
        </>
    );
}

//
