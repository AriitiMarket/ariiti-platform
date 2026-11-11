import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  MapPin,
  ShieldCheck,
  Zap,
  Cpu,
  Search,
  FileCode2,
  Wrench,
  Activity,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";

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

const WORKING_STEPS = [
  {
    number: "01",
    title: "Needs Discovery & Site Audit",
    description:
      "We visit your facility to inspect physical cable paths, power stability, terminal requirements, and existing operational bottlenecks.",
  },
  {
    number: "02",
    title: "Architecture & Feasibility Blueprint",
    description:
      "We engineer the exact software database schemas, MikroTik VLAN topologies, and hardware specifications with transparent pricing.",
  },
  {
    number: "03",
    title: "On-Premise Deployment & Rigorous Testing",
    description:
      "Certified Cat6 terminations, server rack dressing, printer protocol integration, and staff operational training on live systems.",
  },
  {
    number: "04",
    title: "Continuous SLA Care & Backups",
    description:
      "Proactive monthly hardware de-dusting, thermal paste overhaul, daily automated backup audits, and 2-hour priority emergency response.",
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 space-y-16 sm:space-y-20">
      {/* 1. Why Choose Ariiti Tech */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-ariiti-accent hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-ariiti-accent flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-ariiti-navy mb-2">
                  {adv.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {adv.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Company Approach & Working Process */}
      <div className="bg-slate-900 text-white py-14 sm:py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Working Process"
            title="How We Deliver Reliable Technology"
            description="A disciplined, step-by-step engineering approach from initial physical site audit to continuous operational SLA care."
            align="center"
            className="mb-12 text-white [&>h2]:text-white [&>p]:text-slate-300 [&>span]:text-emerald-400"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {WORKING_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black font-mono text-emerald-400 block mb-3">
                    {step.number}
                  </span>
                  <h3 className="font-bold text-base text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-500">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              href="/contact"
              variant="primary"
              size="md"
              className="font-bold bg-white text-ariiti-navy hover:bg-slate-100"
            >
              <span>Schedule a Free Site Discovery Audit</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-ariiti-accent" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
