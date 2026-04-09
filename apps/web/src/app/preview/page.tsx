import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Background } from '@/components/background';
import { DashedLine } from '@/components/dashed-line';
import ClCta from '@/components/collective/cl-cta';
import ClFAQ from '@/components/collective/cl-faq';
import ClFeatures from '@/components/collective/cl-features';
import ClHero from '@/components/collective/cl-hero';
import ClPricing from '@/components/collective/cl-pricing';
import ClTestimonials from '@/components/collective/cl-testimonials';
import ClTracks from '@/components/collective/cl-tracks';
import ClUsecase from '@/components/collective/cl-usecase';
import Separator from '@/components/collective/separator';
import SingleTrack from '@/components/collective/cl-track';
import GoCTA from '@/components/go/go-cta';
import GoFAQ from '@/components/go/go-faq';
import GoFeatures from '@/components/go/go-features';
import GoHero from '@/components/go/go-hero';
import GoPricing from '@/components/go/go-pricing';
import GoUsecase from '@/components/go/go-usecase';
import PPCollective from '@/components/pacepard/pp-collective';
import PPCTA from '@/components/pacepard/pp-cta';
import PPDivider from '@/components/pacepard/pp-divider';
import FAQs from '@/components/pacepard/pp-faq';
import PPFunnel from '@/components/pacepard/pp-funnel';
import PPGo from '@/components/pacepard/pp-go';
import PPHeroSection from '@/components/pacepard/pp-hero';
import PPLovedBy from '@/components/pacepard/pp-lovedby';
import { PPPersona } from '@/components/pacepard/pp-persona';
import Comparator from '@/components/pacepard/pp-pricing';
import { TestimonialsSection } from '@/components/pacepard/pp-testimonials';
import About from '@/components/shared/containers/about';
import { AboutHero } from '@/components/shared/containers/about-hero';
import ComingSoonPanel from '@/components/shared/coming-soon';
import AboutSection from '@/components/shared/sections/about-section';
import Builder from '@/components/shared/sections/builder';
import CallToAction from '@/components/shared/sections/call-to-action';
import Contact from '@/components/shared/sections/contact';
import { ContactForm } from '@/components/shared/sections/contact-form';
import Demo from '@/components/shared/sections/demo';
import { FAQ as SharedFAQ } from '@/components/shared/sections/faq';
import { Features } from '@/components/shared/sections/features';
import FeaturesFour from '@/components/shared/sections/features-4';
import SiteHeroSection from '@/components/shared/sections/hero-section';
import JoinPacepard from '@/components/shared/sections/join-pacepard';
import LensShowcase from '@/components/shared/sections/lens-showcase';
import { PersonasShowcase } from '@/components/shared/sections/persona-showcase';
import Pricing from '@/components/shared/sections/pricing';
import { PricingTable } from '@/components/shared/sections/pricing-table';
import { ResourceAllocation } from '@/components/shared/sections/resource-allocation';
import Starter from '@/components/shared/sections/starter';
import { Testimonials } from '@/components/shared/sections/testimonials';
import HackAboutUs from '@/components/z-hack/sections/about-us';
import HackCTA from '@/components/z-hack/sections/cta';
import HackFAQ from '@/components/z-hack/sections/faq';
import HackHeroSection from '@/components/z-hack/sections/hero-section';
import HackLocation from '@/components/z-hack/sections/location';
import MentorSection from '@/components/z-hack/sections/mentors';
import HackPartners from '@/components/z-hack/sections/partners';
import HackRequirements from '@/components/z-hack/sections/requirments';

export const metadata: Metadata = {
    title: 'Component preview',
    robots: { index: false, follow: false },
};

function PreviewBand({ id, label }: { id: string; label: string }) {
    return (
        <div
            id={id}
            className="scroll-mt-24 border-b border-dashed border-border bg-muted/60 px-4 py-2 font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase"
        >
            {label}
        </div>
    );
}

export default function PreviewPage() {
    if (process.env.NODE_ENV === 'production') {
        notFound();
    }

    return (
        <main className="min-w-0 pb-16">
            <div className="border-b border-border bg-background px-4 py-6">
                <h1 className="text-2xl font-semibold tracking-tight">Component preview</h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    Internal gallery of marketing sections. Layout footer still renders below this page.
                </p>
            </div>

            <PreviewBand id="pacepard-home" label="Pacepard / home" />
            <PPHeroSection />
            <PPPersona />
            <PPCollective />
            <PPDivider />
            <PPGo />
            <Testimonials dashedLineClassName="hidden" />
            <PPCTA />

            <PreviewBand id="pacepard-extras" label="Pacepard / funnel, FAQ, loved-by, pricing comparator" />
            <PPFunnel />
            <FAQs />
            <PPLovedBy />
            <Comparator />

            <PreviewBand id="pacepard-testimonials-marquee" label="Pacepard / testimonials (marquee)" />
            <TestimonialsSection />

            <PreviewBand id="collective" label="Collective" />
            <ClHero />
            <PreviewBand id="collective-single-track" label="Collective / SingleTrack" />
            <div className="container mx-auto max-w-5xl px-4 py-8">
                <SingleTrack />
            </div>
            <ClTracks />
            <Background>
                <Separator />
                <ClFeatures />
                <ClUsecase />
                <ClCta />
                <ClTestimonials />
                <ClFAQ />
            </Background>
            <ClPricing />

            <PreviewBand id="go" label="Go" />
            <GoHero />
            <Background>
                <GoFeatures />
                <GoUsecase />
                <GoFAQ />
                <GoCTA />
                <GoPricing />
            </Background>

            <PreviewBand id="shared-sections" label="Shared sections" />
            <Background>
                <Builder />
                <LensShowcase />
                <SiteHeroSection />
                <Features />
                <FeaturesFour />
                <CallToAction />
                <PersonasShowcase />
                <ResourceAllocation />
                <AboutSection />
                <Pricing />
                <PricingTable />
                <SharedFAQ
                    className="py-16 text-center lg:py-24"
                    className2="max-w-xl lg:grid-cols-1"
                    headerTag="h2"
                />
                <Contact />
                <div className="container mx-auto max-w-3xl px-4 py-12">
                    <p className="mb-6 text-center text-sm font-medium text-muted-foreground">ContactForm</p>
                    <ContactForm />
                </div>
                <Starter />
                <Demo />
                <JoinPacepard />
            </Background>

            <PreviewBand id="coming-soon" label="Coming soon panel" />
            <ComingSoonPanel
                title="Preview: coming soon"
                description="Example copy for a route that is not live yet."
                showCountdown={false}
            />

            <PreviewBand id="about" label="About page sections" />
            <Background>
                <div className="py-16 lg:py-24 lg:pt-32">
                    <AboutHero />
                    <About />
                    <div className="pt-16 lg:pt-24">
                        <DashedLine className="container max-w-5xl scale-x-115" />
                        <MentorSection />
                    </div>
                </div>
            </Background>

            <PreviewBand id="hack-ogbomoso" label="Hack Ogbomoso (no duplicate header)" />
            <div className="min-h-0 w-full overflow-hidden bg-green text-foreground">
                <HackHeroSection />
                <HackAboutUs />
                <HackRequirements />
                <HackLocation />
                <HackPartners />
                <MentorSection />
                <HackCTA />
                <HackFAQ />
            </div>
        </main>
    );
}
