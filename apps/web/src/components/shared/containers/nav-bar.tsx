'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChevronRight, X, Linkedin, ArrowRightToLineIcon } from 'lucide-react';

import { NavigationItems } from '@/_data/pacepard/navigation';
import { Background } from '@/components/background';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@pacepard/ui/lib/utils';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);

            // Automatically close the mobile menu/dropdown on scroll
            if (isMenuOpen) {
                setIsMenuOpen(false);
                setOpenDropdown(null);
            }
        };

        // Attach the event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMenuOpen]);

    return (
        <>
            <header
                className={cn(
                    'sticky top-0 z-50 w-full transition-all duration-300',
                    'bg-background/70 backdrop-blur-md border-b border-border/70',
                    isMenuOpen && 'max-lg:bg-background',
                )}
            >
                {/* 1. Increased Vertical Padding to make the header taller (e.g., py-10 for 40px top/bottom padding) */}
                <div
                    className={cn(
                        'relative mx-auto flex max-w-8xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8',
                        'max-lg:z-[110]',
                    )}
                >
                    {/* Logo and Desktop Navigation */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="flex shrink-0 items-center gap-2"
                        >
                            <Image
                                src="blocks/pacepard1.svg"
                                alt="pacepard logo"
                                width={150}
                                height={20}
                                className="dark:invert"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <NavigationMenu className="max-lg:hidden">
                            <NavigationMenuList className="space-x-4">
                                {NavigationItems.map((link) =>
                                    link.dropdownItems ? (
                                        <NavigationMenuItem
                                            key={link.label}
                                            className=""
                                        >
                                            <NavigationMenuTrigger className="data-[state=open]:bg-accent/50 bg-transparent! px-1.5 text-sm md:text-base">
                                                {link.label}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="w-[400px] space-y-2 p-4">
                                                    {link.dropdownItems.map(
                                                        (item) => (
                                                            <li
                                                                key={item.title}
                                                            >
                                                                <NavigationMenuLink
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={
                                                                            item.href
                                                                        }
                                                                        className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center gap-4 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none"
                                                                    >
                                                                        <div className="space-y-1.5 transition-transform duration-300 group-hover:translate-x-1">
                                                                            <div className="text-sm leading-none font-medium">
                                                                                {
                                                                                    item.title
                                                                                }
                                                                            </div>
                                                                            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                                                                {
                                                                                    item.description
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    ) : (
                                        <NavigationMenuItem
                                            key={link.label}
                                            className=""
                                        >
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    'relative bg-transparent px-1.5 text-sm md:text-base font-medium transition-opacity hover:opacity-75',
                                                    pathname === link.href &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {link.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ),
                                )}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Auth Buttons and Theme Toggle (right side) */}
                    <div className="flex items-center gap-2.5">
                        {/* <ThemeToggle /> */}

                        <div className="flex items-center gap-2.5 max-lg:hidden">
                            {!scrolled && (
                                <>
                                    <Button asChild variant="link" size="lg" className="text-sm md:text-base">
                                        <Link href="/login">
                                            <span className="text-foreground hover:text-accent-foreground relative z-10">
                                                Login
                                            </span>
                                        </Link>
                                    </Button>
                                        {/* 
                                    <Button asChild size="sm">
                                        <Link href="/register">
                                            <span className="relative z-10">
                                                Register
                                            </span>
                                        </Link>
                                    </Button> */}
                                    <Button asChild size="lg" className="text-sm md:text-base">
                                        <Link href="/apprenticeship">
                                            <span className="">
                                                Get Started
                                            </span>
                                            <ArrowRightToLineIcon />
                                        </Link>
                                    </Button>
                                </>
                            )}

                            {scrolled && (
                                <Button asChild size="lg" className="text-sm md:text-base">
                                    <Link href="mailto:hello@pacepard.com">
                                        <span>Contact sales</span>
                                        <ArrowRightToLineIcon />
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Hamburger Menu Button (Mobile Only) */}
                        <button
                            className="text-muted-foreground relative flex size-8 lg:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="sr-only">
                                {isMenuOpen ? 'Close main menu' : 'Open main menu'}
                            </span>
                            <div className="absolute top-1/2 left-1/2 block w-[18px] -translate-x-1/2 -translate-y-1/2">
                                <span
                                    aria-hidden="true"
                                    className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}
                                ></span>
                                <span
                                    aria-hidden="true"
                                    className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`}
                                ></span>
                                <span
                                    aria-hidden="true"
                                    className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}
                                ></span>
                            </div>
                        </button>
                    </div>
                </div>

                {/*  Mobile Menu Navigation */}
                <Background variant="bottom">
                    <div
                        className={cn(
                            'bg-white fixed inset-0 z-[100] flex h-[100dvh] max-h-[100dvh] flex-col overflow-y-auto px-6 pb-6 pt-20 transition-all duration-300 ease-in-out lg:hidden',
                            isMenuOpen
                                ? 'visible opacity-100'
                                : 'pointer-events-none invisible -translate-y-4 opacity-0',
                        )}
                    >
                        <nav className="divide-border flex flex-1 flex-col divide-y">
                            {NavigationItems.map((link) =>
                                link.dropdownItems ? (
                                    <div
                                        key={link.label}
                                        className="py-4 first:pt-0 last:pb-0"
                                    >
                                        <button
                                            onClick={() =>
                                                setOpenDropdown(
                                                    openDropdown === link.label
                                                        ? null
                                                        : link.label,
                                                )
                                            }
                                            className="text-foreground flex w-full items-center justify-between text-base font-medium"
                                        >
                                            {link.label}
                                            <ChevronRight
                                                className={cn(
                                                    'size-4 transition-transform duration-200',
                                                    openDropdown === link.label
                                                        ? 'rotate-90'
                                                        : '',
                                                )}
                                            />
                                        </button>
                                        <div
                                            className={cn(
                                                'overflow-hidden transition-all duration-300',
                                                openDropdown === link.label
                                                    ? 'mt-4 max-h-[1000px] opacity-100'
                                                    : 'max-h-0 opacity-0',
                                            )}
                                        >
                                            <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                                                {link.dropdownItems.map(
                                                    (item) => (
                                                        <Link
                                                            key={item.title}
                                                            href={item.href}
                                                            className="group hover:bg-accent block rounded-md p-2 transition-colors"
                                                            onClick={() => {
                                                                setIsMenuOpen(
                                                                    false,
                                                                );
                                                                setOpenDropdown(
                                                                    null,
                                                                );
                                                            }}
                                                        >
                                                            <div className="transition-transform duration-200 group-hover:translate-x-1">
                                                                <div className="text-foreground font-medium">
                                                                    {item.title}
                                                                </div>

                                                                <p className="text-muted-foreground mt-1 text-sm">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={cn(
                                            'text-foreground hover:text-foreground/80 py-4 text-base font-medium transition-colors first:pt-0 last:pb-0',
                                            pathname === link.href &&
                                                'text-muted-foreground',
                                        )}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ),
                            )}
                        </nav>

                        {/* --- Updated Mobile Tagline and Social Icons --- */}
                        <div className="mt-12 pt-4 border-t border-border/70">
                            {/* Tagline - Left aligned */}
                            <p className="text-left text-sm text-muted-foreground mb-4">
                           The growth platform for AI-Native Product teams.
                            </p>

                            {/* 2. Social Icons Section - Changed to flex row and added items-center for vertical alignment */}
                            <div className="flex items-center justify-start space-x-4">
                                {/* "Follow us:" text */}
                                <p className="text-sm font-medium text-foreground">
                                    Follow us:
                                </p>

                                {/* Social Icons container */}
                                <div className="flex space-x-6">
                                    <Link
                                        href="#" // Replace with actual X/Twitter link
                                        aria-label="Follow on X (Twitter)"
                                        className="w-9 h-9 bg-accent dark:bg-accent hover:bg-primary dark:hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <X className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href="#" // Replace with actual LinkedIn link
                                        aria-label="Follow on LinkedIn"
                                        className="w-9 h-9 bg-accent dark:bg-accent hover:bg-primary dark:hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Background>
            </header>
        </>
    );
};
