import { Background } from '@/components/background';
import PPHeroSection from '@/components/pacepard/pp-hero';
import { PPPersona } from '@/components/pacepard/pp-persona';

import PPGo from '@/components/pacepard/pp-go';
import PPCollective from '@/components/pacepard/pp-collective';
import PPCTA from '@/components/pacepard/pp-cta';

export default function Home() {
    return (
        <>
            <PPHeroSection />
    

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
