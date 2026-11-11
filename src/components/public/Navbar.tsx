"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronRight, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import AriitiLogo from "@/components/ui/AriitiLogo";
import type { IWebsiteSettings } from "@/models/WebsiteSettings";

interface NavbarProps {
  settings?: IWebsiteSettings;
}

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog / News", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const phone = settings?.primaryPhone || "+251 915 000 000";

  // Handle subtle elevation shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white transition-all duration-200 border-b",
        scrolled
          ? "border-slate-200/90 shadow-md"
          : "border-slate-200/70 shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left section: Official Ariiti Tech Logo & Brand Name */}
          <div className="flex items-center shrink-0">
            <AriitiLogo
              variant="dark"
              size="md"
              href="/"
              showSubtitle={true}
              subtitle="Technologies"
            />
          </div>

          {/* Center navigation section (Desktop: lg screens and above) */}
          <nav
            className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#093053] focus-visible:ring-offset-2 select-none",
                    active
                      ? "text-[#093053] bg-slate-100/90 font-bold"
                      : "text-slate-700 hover:text-[#093053] hover:bg-slate-50"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span
                      className="absolute bottom-0 inset-x-3 h-0.5 bg-[#093053] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right section: Primary CTA Button (Desktop: lg screens and above) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#093053] text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-[#07243e] active:scale-[0.98] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#093053] focus-visible:ring-offset-2"
            >
              <span>Request a Service</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90" />
            </Link>
          </div>

          {/* Mobile & Tablet: Accessible Menu Toggle Button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#093053] hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#093053] focus-visible:ring-offset-2 transition-colors"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-[#093053]" />
              ) : (
                <Menu className="w-6 h-6 text-[#093053]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Tablet & Mobile Menu Drawer */}
      {isOpen && (
        <div
          id="mobile-navigation-menu"
          className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-4.5rem)] overflow-y-auto"
          role="region"
          aria-label="Mobile Navigation Menu"
        >
          <div className="space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#093053]",
                    active
                      ? "text-[#093053] bg-slate-100 font-bold border-l-4 border-[#093053] pl-3"
                      : "text-slate-800 hover:bg-slate-50 hover:text-[#093053]"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{link.name}</span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4",
                      active ? "text-[#093053]" : "text-slate-400"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile CTA Button: Request a Service */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#093053] text-white text-sm font-bold shadow-md hover:bg-[#07243e] active:scale-[0.99] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#093053] focus-visible:ring-offset-2"
            >
              <span>Request a Service</span>
              <ArrowRight className="w-4 h-4 text-white/90" />
            </Link>

            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#093053]"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#093053]" />
                <span>Call Directly: {phone}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
