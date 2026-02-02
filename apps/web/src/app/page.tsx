import { Background } from '@/components/background';
import PPHeroSection from '@/components/pacepard/pp-hero';
import PPLovedBy from '@/components/pacepard/pp-lovedby';
import { PPPersona } from '@/components/pacepard/pp-persona';
import { PPTestimonials } from '@/components/pacepard/pp-testimonials';
import PPGo from '@/components/pacepard/pp-go';
import PPCollective from '@/components/pacepard/pp-collective';
import PPCTA from '@/components/pacepard/pp-cta';
import CCHeroSection from '@/components/pacepard/center';

export default function Home() {
    return (
        <>
            <PPHeroSection />
            {/* <CCHeroSection/> */}
            {/* <PPLovedBy /> */}

            <Background>
                <PPPersona />

                <PPCollective />
                <PPCTA />
                <PPGo />

                {/* <PPTestimonials /> */}
            </Background>

           
        </>
    );
}
