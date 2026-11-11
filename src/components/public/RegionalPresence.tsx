import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Building,
  ArrowRight,
  ExternalLink,
  Navigation,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface RegionalPresenceProps {
  className?: string;
  showCta?: boolean;
}

export const RegionalPresence: React.FC<RegionalPresenceProps> = ({
  className = "",
  showCta = true,
}) => {
  return (
    <section
      className={`bg-brand-primary text-white rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden border border-[#0d3f6d] shadow-2xl ${className}`}
      aria-label="Physical Office and Regional Presence"
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/15">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 font-mono">
                Verified Physical Presence
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              On-the-Ground Presence in Harar and Dire Dawa
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg font-mono font-medium">
              SLA DISPATCH READY: &lt;2-HR
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-3xl mb-10">
          Unlike remote agencies that offer only telephone advice when hardware fails,
          Ariiti Tech maintains resident technical facilities and full-time field
          specialists in both Harar and Dire Dawa. Our engineers arrive on-site with
          spare parts, diagnostic tools, and termination equipment to eliminate downtime.
        </p>

        {/* 2 Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Harar Technical Hub */}
          <div className="bg-[#0c375e] border border-[#13497b] rounded-2xl overflow-hidden hover:border-[#1d5c96] transition-all duration-200 flex flex-col group">
            {/* Visual Header */}
            <div className="relative h-44 w-full bg-brand-primary overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                alt="Harar Technical Hub Operations Office"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c375e] via-[#0c375e]/40 to-transparent" />
              <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md backdrop-blur-md">
                HEAD OPERATIONS
              </div>
              <div className="absolute bottom-3 left-4">
                <h3 className="font-bold text-lg text-white">Harar Technical Hub</h3>
                <span className="text-xs text-white/80">Software & SLA Dispatch Center</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <ul className="space-y-2.5 text-xs text-white/80">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                  <span>Kebele 14 Commercial Corridor, Harar, Ethiopia</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                  <span>Mon – Sat: 8:00 AM – 6:30 PM (24/7 Priority Emergency Hotline)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Guaranteed &lt;2-hour on-premise arrival for critical SLA incidents</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <a
                  href="tel:+251915000000"
                  className="text-xs font-mono font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>+251 915 000 000</span>
                </a>
                <span className="text-[11px] text-white/60 font-medium">
                  Harar Dispatch Node
                </span>
              </div>
            </div>
          </div>

          {/* Dire Dawa Field Office */}
          <div className="bg-[#0c375e] border border-[#13497b] rounded-2xl overflow-hidden hover:border-[#1d5c96] transition-all duration-200 flex flex-col group">
            {/* Visual Header */}
            <div className="relative h-44 w-full bg-brand-primary overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
                alt="Dire Dawa Field Operations Facility"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c375e] via-[#0c375e]/40 to-transparent" />
              <div className="absolute top-3 right-3 bg-white/20 text-white border border-white/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md backdrop-blur-md">
                INFRASTRUCTURE & FIELD
              </div>
              <div className="absolute bottom-3 left-4">
                <h3 className="font-bold text-lg text-white">Dire Dawa Field Office</h3>
                <span className="text-xs text-white/80">Commercial LAN & Industrial Equipment</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <ul className="space-y-2.5 text-xs text-white/80">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                  <span>Kezira Commercial District, Dire Dawa, Ethiopia</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                  <span>Mon – Sat: 8:00 AM – 6:30 PM (Rapid Field Unit)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>On-premise stock of Cat6 cable, thermal receipt printers & routers</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <a
                  href="tel:+251920000000"
                  className="text-xs font-mono font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>+251 920 000 000</span>
                </a>
                <span className="text-[11px] text-white/60 font-medium">
                  Dire Dawa Dispatch Node
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Coverage Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-white/70 border-t border-white/15 pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white">Active Service Coverage:</span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white/90">Harar City</span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white/90">Dire Dawa Free Trade & Industrial Zone</span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white/90">Aweday Commercial Corridor</span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white/90">Haramaya Institutional Campus</span>
          </div>
          <span className="font-mono text-emerald-300 font-semibold text-[11px]">
            ● 100% REGIONAL SLA COMMITMENT
          </span>
        </div>

        {showCta && (
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Button
              href="/contact"
              variant="secondary"
              size="md"
              className="w-full sm:w-auto font-bold shadow-lg"
            >
              <span>Schedule an On-Site Engineering Visit</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-brand-primary" />
            </Button>
            <a
              href="tel:+251915000000"
              className="text-xs text-white/80 hover:text-white flex items-center gap-2 font-mono"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Emergency SLA Dispatch: +251 915 000 000</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default RegionalPresence;
