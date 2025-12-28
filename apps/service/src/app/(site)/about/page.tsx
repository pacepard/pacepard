
import AboutusDetail from "@/app/components/about/aboutus-detail";
import AboutusFullimg from "@/app/components/about/aboutus-fullimg";
import AboutusStats from "@/app/components/about/aboutus-stats";
import Team from "@/app/components/home/team";
import Herobanner from "@/app/components/shared/hero-banner";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Aboutus | Pacepard",
};

export default function Page() {
    return (
        <main>
            <Herobanner
                bannerimage="/images/about-us/banner/PACEPARDT.jpg"
                heading="About us"
                desc="We engineer <span>complex ideas into intelligent</span> living systems that scale, adapt, and perform in the real world." />
            <AboutusDetail />
            <AboutusStats/>
            <AboutusFullimg/>
            <Team teamdataNumber="01"/>
        </main>
    );
};
