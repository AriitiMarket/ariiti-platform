import React from "react";
import Link from "next/link";
import { IWebsiteSettings } from "@/models/WebsiteSettings";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ExternalLink,
  Shield,
  ArrowUpRight,
  Send,
  Clock,
} from "lucide-react";

const LinkedInIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.2a1.62 1.62 0 1 0 1.62 1.62A1.63 1.63 0 0 0 7.84 6.2Z" />
  </svg>
);

interface FooterProps {
  settings: IWebsiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-10">
          {/* Col 1 & 2: Brand, Organizational Mission & Hubs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ariiti-navy flex items-center justify-center text-white font-black text-xl shadow-md border border-slate-700">
                A
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight block">
                  {settings.companyName || "ARIITI TECH"}
                </span>
                <span className="text-[10px] tracking-widest uppercase text-ariiti-accent font-bold">
                  Eastern Ethiopia Infrastructure
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.tagline ||
                "Building reliable enterprise technology, commercial networking, and offline-first software solutions tailored to Eastern Ethiopia."}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                On-The-Ground Operations Hubs:
              </p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-ariiti-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Harar:</strong> Kebele 14 Commercial Corridor
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dire Dawa:</strong> Kezira Commercial District
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Solutions & Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Solutions & Services
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link
                  href="/services#software"
                  className="hover:text-white transition-colors"
                >
                  Custom Software Development
                </Link>
              </li>
              <li>
                <Link
                  href="/services#networking"
                  className="hover:text-white transition-colors"
                >
                  Commercial Cat6 & Fiber LAN
                </Link>
              </li>
              <li>
                <Link
                  href="/services#hardware"
                  className="hover:text-white transition-colors"
                >
                  POS Hardware & Touch Terminals
                </Link>
              </li>
              <li>
                <Link
                  href="/services#maintenance"
                  className="hover:text-white transition-colors"
                >
                  Preventive IT Maintenance SLAs
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-ariiti-accent font-semibold hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <span>All Engineering Services</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Ecosystem & Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Ecosystem & Company
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Ariiti Tech
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Proprietary Software Products
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="hover:text-white transition-colors"
                >
                  Verified Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="hover:text-white transition-colors"
                >
                  Engineering Team
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Technical Articles & News
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Request a Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-slate-500 hover:text-slate-400 transition-colors inline-block pt-1"
                >
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Contact Channels */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Direct Contact
            </h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col font-mono">
                  <a
                    href={`tel:${settings.primaryPhone}`}
                    className="hover:text-white transition-colors font-bold text-slate-200"
                  >
                    {settings.primaryPhone}
                  </a>
                  {settings.secondaryPhone && (
                    <a
                      href={`tel:${settings.secondaryPhone}`}
                      className="hover:text-white transition-colors text-slate-400 text-[11px]"
                    >
                      {settings.secondaryPhone}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-ariiti-accent shrink-0" />
                <a
                  href={`mailto:${settings.businessEmail}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {settings.businessEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || "").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors font-semibold text-emerald-400"
                >
                  Chat on WhatsApp Directly
                </a>
              </li>

              {/* Social Channels */}
              <li className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Official Channels:
                </span>
                <div className="flex items-center gap-2">
                  {settings.socialLinks?.telegram && (
                    <a
                      href={settings.socialLinks.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-ariiti-accent transition-colors"
                      aria-label="Telegram"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {settings.socialLinks?.linkedin && (
                    <a
                      href={settings.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-ariiti-accent transition-colors"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>
            &copy; {currentYear} {settings.companyName || "Ariiti Tech"}. All rights
            reserved. Harar & Dire Dawa, Eastern Ethiopia.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contractual 2-Hour Emergency SLA Dispatch</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
