import { Background } from '@/components/background';
import PPHeroSection from '@/components/pacepard/pp-hero';
import PPLovedBy from '@/components/pacepard/pp-lovedby';
import { PPPersona } from '@/components/pacepard/pp-persona';

import PPGo from '@/components/pacepard/pp-go';
import PPCollective from '@/components/pacepard/pp-collective';
import PPCTA from '@/components/pacepard/pp-cta';
import CCHeroSection from '@/components/pacepard/center';
import ComingSoon from '@/components/pacepard/coming-soon'; 

export default function Home() {
    return (
        <>
            <PPHeroSection />
            <ComingSoon/>
            {/* <CCHeroSection/> */}
            {/* <PPLovedBy /> */}

            <Background>
                <PPPersona />

                <PPCollective />
                
                <PPGo />
                <PPCTA />

                {/* <PPTestimonials /> */}
            </Background>

           
        </>
    );
}
