import { Background } from '@/components/background';
import PPHeroSection from '@/components/pacepard/pp-hero';
import { PPPersona } from '@/components/pacepard/pp-persona';

import PPGo from '@/components/pacepard/pp-go';
import PPCollective from '@/components/pacepard/pp-collective';
import PPCTA from '@/components/pacepard/pp-cta';
import PPDivider from '@/components/pacepard/pp-divider';
import { Testimonials } from '@/components/shared/sections/testimonials';

export default function Home() {
    return (
        <>
            <PPHeroSection />

        
                <PPPersona />
                {/* <Background> */}
                <PPCollective />

                <PPDivider />

                <PPGo />
                <Testimonials dashedLineClassName="hidden" />
                
                <PPCTA />

                {/* <PPTestimonials /> */}
            {/* </Background> */}
        </>
    );
}

//
