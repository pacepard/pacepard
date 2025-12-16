import Header from "@/components/hack/containers/header";
import AboutUs from "@/components/hack/sections/about-us";
import CallToAction from "@/components/hack/sections/cta";
import FAQs from "@/components/hack/sections/faq";
import HeroSection from "@/components/hack/sections/hero-section";
import Location from "@/components/hack/sections/location";
import MentorSection from "@/components/hack/sections/mentors";
import Partners from "@/components/hack/sections/partners";
import Requirements from "@/components/hack/sections/requirments";
import Footer from "@/components/pacepard/sections/footer";


const HackOgbomoso = () => {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-green text-foreground">
        
        <Header />
        <HeroSection />
        <AboutUs />
        <Requirements />
        <Location />
        <Partners/>
        <MentorSection />
        <CallToAction />
        <FAQs />
        <Location />
        
        <Footer />
        
    </main>
  );
};

export default HackOgbomoso;
