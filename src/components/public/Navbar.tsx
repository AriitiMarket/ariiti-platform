"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  MessageCircle,
  Send,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IWebsiteSettings } from "@/models/WebsiteSettings";

interface NavbarProps {
  settings?: IWebsiteSettings;
}

const LinkedInIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.2a1.62 1.62 0 1 0 1.62 1.62A1.63 1.63 0 0 0 7.84 6.2Z" />
  </svg>
);

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Team", href: "/team" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const phone = settings?.primaryPhone || "+251 915 000 000";
  const email = settings?.businessEmail || "contact@ariititech.com";
  const telegram = settings?.socialLinks?.telegram || "https://t.me/aritiiteck";
  const linkedin =
    settings?.socialLinks?.linkedin || "https://linkedin.com/company/ariiti-tech";
  const whatsappNum = settings?.whatsappNumber || "251915000000";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* 1. Slim Compact Top Info Bar (Low Height, High Utility) */}
      <div className="bg-slate-950 text-slate-300 text-[10.5px] py-1 px-3 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Operating Area & Business Hours */}
          <div className="flex items-center gap-3 truncate">
            <div className="flex items-center gap-1 font-medium text-slate-200">
              <MapPin className="w-3 h-3 text-ariiti-accent shrink-0" />
              <span className="truncate">Harar & Dire Dawa Hubs</span>
            </div>
            <span className="hidden md:inline text-slate-700">|</span>
            <div className="hidden md:flex items-center gap-1 text-slate-400">
              <Clock className="w-2.5 h-2.5 text-slate-500 shrink-0" />
              <span>Mon–Sat 8AM–6:30PM</span>
            </div>
          </div>

          {/* Contact & Status */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-[9.5px] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>&lt;2-Hr SLA Ready</span>
            </div>

            <a
              href={`mailto:${email}`}
              className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-2.5 h-2.5 text-slate-400" />
              <span className="truncate max-w-[150px]">{email}</span>
            </a>

            <span className="hidden lg:inline text-slate-700">|</span>

            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-1 font-mono text-white hover:text-ariiti-accent transition-colors font-bold text-[11px]"
            >
              <PhoneCall className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
              <span>{phone}</span>
            </a>

            {/* Social Icons */}
            <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-slate-800">
              {telegram && (
                <a
                  href={telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-0.5 rounded text-slate-400 hover:text-white transition-colors"
                  aria-label="Telegram"
                >
                  <Send className="w-2.5 h-2.5" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-0.5 rounded text-slate-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Compact Main Navigation Bar (Tight Height, Zero Wasted Space) */}
      <div
        className={cn(
          "w-full transition-all duration-150 bg-white/95 backdrop-blur-md border-b",
          scrolled ? "border-slate-200/90 shadow-sm" : "border-slate-200/60"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-13 sm:h-14">
            {/* Brand Logo & Name */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none rounded-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-ariiti-navy flex items-center justify-center text-white shadow-sm group-hover:bg-ariiti-accent transition-colors">
                <span className="font-black text-base tracking-tight text-white">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black text-ariiti-navy tracking-tight group-hover:text-ariiti-accent transition-colors leading-none">
                  ARIITI TECH
                </span>
                <span className="text-[9px] tracking-widest uppercase text-ariiti-muted font-bold -mt-0.5">
                  Eastern Ethiopia
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Compact padding) */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-150 relative",
                      active
                        ? "text-ariiti-navy bg-slate-100 font-bold"
                        : "text-slate-700 hover:text-ariiti-navy hover:bg-slate-50"
                    )}
                  >
                    <span>{link.name}</span>
                    {active && (
                      <span className="absolute bottom-0 inset-x-2.5 h-0.5 bg-ariiti-accent rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Button (Desktop Compact) */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md bg-ariiti-navy text-white text-xs font-bold shadow-sm hover:bg-ariiti-accent active:scale-[0.98] transition-all duration-150"
              >
                <span>Request a Service</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-md text-slate-700 hover:text-ariiti-navy hover:bg-slate-100 focus:outline-none"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {isOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl">
            <div className="space-y-0.5 pt-1">
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                      active
                        ? "text-ariiti-navy bg-slate-100 font-bold border-l-4 border-ariiti-accent pl-2.5"
                        : "text-slate-800 hover:bg-slate-50 hover:text-ariiti-navy"
                    )}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-ariiti-navy text-white text-xs font-bold shadow-md hover:bg-ariiti-accent transition-colors"
              >
                <span>Request a Service</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
              </Link>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-1 p-2 rounded-md bg-slate-100 text-slate-800 text-xs font-bold font-mono"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-600" />
                  <span>Call Office</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 p-2 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
