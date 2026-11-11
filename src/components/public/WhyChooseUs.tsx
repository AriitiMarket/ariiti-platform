import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { MapPin, ShieldCheck, Zap, Cpu } from "lucide-react";

const ADVANTAGES = [
  {
    icon: MapPin,
    title: "On-The-Ground Local Presence",
    description:
      "Unlike remote firms offering only phone advice, our full-time engineers are resident in Harar and Dire Dawa for physical on-site deployment and rapid response.",
  },
  {
    icon: Zap,
    title: "Offline-First Resilience",
    description:
      "Engineered specifically for Eastern Ethiopia's network realities. Billing, POS, and local operations continue ringing even with complete ISP link loss.",
  },
  {
    icon: ShieldCheck,
    title: "Contractual <2-Hour Emergency SLA",
    description:
      "Guaranteed on-premise emergency arrival for critical outages, backed by verified daily cloud and local NAS database backups.",
  },
  {
    icon: Cpu,
    title: "Enterprise Hardware & Local Spares",
    description:
      "We supply only commercial-grade terminals, thermal printers, and switches tested for high volume and backed by local replacement spares.",
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Why Choose Ariiti Tech"
        title="Practical Engineering. Regional Accountability."
        description="We measure our success not by abstract vanity metrics, but by the tangible operational uptime, transaction speed, and efficiency gained by regional businesses."
        align="center"
        className="mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ADVANTAGES.map((adv, idx) => {
          const Icon = adv.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-[#093053] hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-[#093053]/5 border border-[#093053]/10 text-[#093053] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#093053] mb-2">
                {adv.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {adv.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseUs;
