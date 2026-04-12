import { Background } from '@/components/background';
import PPHeroSection from '@/components/pacepard/pp-hero';
import PPCTA from '@/components/pacepard/pp-cta';


import ClTestimonials from '@/components/collective/cl-testimonials';
import PPFeatureShowcase from '@/components/pacepard/pp-feature-showcase';
import Testimonials from '@/components/pacepard/testimonials';
import PPApprenticeshipIntro from '@/components/pacepard/pp-apprenticship-intro';

export default function Home() {
    return (
        <>
            <PPHeroSection />

            {/* <PPPersona /> */}
            <Testimonials />
            {/* <Background> */}
            <PPApprenticeshipIntro />
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
