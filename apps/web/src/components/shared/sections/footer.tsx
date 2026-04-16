import {
    BRAND_INFO,
    SOCIAL_LINKS_DATA,
    FOOTER_LINKS_DATA,
    FOOTER_BOTTOM_TEXT,
} from '@/_data/pacepard/footer';
import { DashedLine } from '@/components/dashed-line';

import { Logo } from '@/components/shared/containers/logo';
import {
    GitHubIcon,
    LinkedInIcon,
    XIcon,
} from '@/components/shared/containers/social-icons';
// Map the string IDs from the data file to the actual imported icon components
const SOCIAL_ICON_MAP = {
    github: GitHubIcon,
    linkedin: LinkedInIcon,
    x: XIcon,
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="mx-auto max-w-7xl w-full relative ">
                <div className="px-6 py-12 mt-12">
                    <div className="flex mt-6 flex-col md:flex-row md:flex-wrap lg:flex-row lg:justify-between gap-10 lg:gap-24">
                        {/* Brand Section (Uses BRAND_INFO) */}
                        <div className="space-y-4">
                            <div className="flex items-center ">
                                <Logo className="scale-170 md:scale-250 ml-8 md:ml-17" />

                                {/* <Link
                                    href="/"
                                    className="flex shrink-0 items-center gap-2"
                                >
                                    <Image
                                        src="/blocks/pacepard.svg"
                                        alt="pacepard logo"
                                        width={250}
                                        height={20}
                                    />
                                </Link> */}
                            </div>

                            {/* Brand Description */}
                            <p className="text-lg text-neutral-400 leading-relaxed max-w-sm">
                                {BRAND_INFO.description}
                            </p>

                            {/* Social Links (Uses SOCIAL_LINKS_DATA) */}
                            <div className="flex space-x-3">
                                {SOCIAL_LINKS_DATA.map((social) => {
                                    const IconComponent =
                                        SOCIAL_ICON_MAP[social.id];
                                    if (!IconComponent) return null; // Safety check

                                    return (
                                        <a
                                            key={social.id}
                                            href={social.href}
                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent bg-accent text-foreground transition-colors hover:border-primary/15 hover:bg-primary hover:text-primary-foreground"
                                            aria-label={social.ariaLabel}
                                        >
                                            <IconComponent className="h-4 w-4 shrink-0 [&_path]:fill-current" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Link Sections (Uses FOOTER_LINKS_DATA) */}
                        <div className="flex flex-col md:flex-row gap-10 lg:gap-24">
                            {FOOTER_LINKS_DATA.map((section, index) => (
                                <div key={index} className="space-y-4">
                                    <h3 className="font-semibold">
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {section.links.map(
                                            (link, linkIndex) => (
                                                <li key={linkIndex}>
                                                    <a
                                                        href={link.href}
                                                        target={
                                                            link.external
                                                                ? '_blank'
                                                                : '_self'
                                                        }
                                                        rel={
                                                            link.external
                                                                ? 'noopener noreferrer'
                                                                : undefined
                                                        }
                                                        className="text-lg text-neutral-400 hover:text-primary transition-colors"
                                                    >
                                                        <span className="inline-flex items-center gap-2">
                                                            {link.label}
                                                            {section.title ===
                                                                'Product' &&
                                                            linkIndex === 0 ? (
                                                                <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                                                                    New
                                                                </span>
                                                            ) : null}
                                                        </span>
                                                    </a>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pacepard Text */}
                    <div className="mt-24 flex justify-center ">
                        <span className="text-[4.5rem] md:text-[12rem] lg:text-[15rem] lg:text-[17.6rem] font-bold select-none leading-none bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 inset-x-0">
                            {BRAND_INFO.name}
                        </span>
                    </div>

                    {/* Bottom Copyright and Attribution */}
                    <div className="mt-10 md:mt-32">
                        <DashedLine
                            orientation="horizontal"
                            className="scale-x-105"
                        />
                    </div>
                    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row pt-8">
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-neutral-800">
                            <p className="text-sm text-neutral-500">
                                {FOOTER_BOTTOM_TEXT.madeBy}
                            </p>
                        </div>
                        <p className="text-sm text-neutral-500">
                            &copy; {currentYear}{' '}
                            <a
                                href={FOOTER_BOTTOM_TEXT.copyrightHref}
                                className=" text-neutral-400 hover:text-primary transition-colors"
                            >
                                {FOOTER_BOTTOM_TEXT.copyrightName}
                            </a>
                            {FOOTER_BOTTOM_TEXT.rights}
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
