import Header from '@/components/z-hack/containers/header';
import AboutUs from '@/components/z-hack/sections/about-us';
import CallToAction from '@/components/z-hack/sections/cta';
import FAQs from '@/components/z-hack/sections/faq';
import HeroSection from '@/components/z-hack/sections/hero-section';
import Location from '@/components/z-hack/sections/location';
import MentorSection from '@/components/z-hack/sections/mentors';
import Partners from '@/components/z-hack/sections/partners';
import Requirements from '@/components/z-hack/sections/requirments';
import Footer from '@/components/shared/sections/footer';

const HackOgbomoso = () => {
    return (
        <main className="min-h-screen w-full overflow-hidden bg-green text-foreground">
            <Header />
            <HeroSection />
            <AboutUs />
            <Requirements />
            <Location />
            <Partners />
            <MentorSection />
            <CallToAction />
            <FAQs />
            <Location />

            <Footer />
        </main>
    );
};

export default HackOgbomoso;
