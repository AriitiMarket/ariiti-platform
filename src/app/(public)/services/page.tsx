import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/public/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import ServiceCard from "@/components/public/ServiceCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import TrustMetricsBanner from "@/components/public/TrustMetricsBanner";
import RegionalPresence from "@/components/public/RegionalPresence";
import { getActiveServices } from "@/lib/queries/publicData";
import {
  Code2,
  Network,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Layers,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Corporate IT & Software Services",
  description:
    "Explore Ariiti Tech's enterprise solutions: custom software development, commercial networking, POS equipment integration, and preventive IT support SLAs in Eastern Ethiopia.",
};

export const revalidate = 60;

const CATEGORIES = [
  {
    id: "software-development",
    key: "SOFTWARE_DEVELOPMENT",
    title: "Software Development",
    icon: Code2,
    description:
      "Web applications, mobile applications, business management systems, and custom software solutions engineered for high performance and regional resilience.",
  },
  {
    id: "networking-infrastructure",
    key: "NETWORKING_INFRASTRUCTURE",
    title: "Networking & IT Infrastructure",
    icon: Network,
    description:
      "LAN and Wi-Fi installation, router and switch configuration, structured network cabling, and comprehensive network troubleshooting.",
  },
  {
    id: "hardware-support",
    key: "HARDWARE_EQUIPMENT",
    title: "Hardware & Technical Support",
    icon: Cpu,
    description:
      "Computer setup and maintenance, receipt printer and peripheral setup, UPS and hardware installation, and dedicated on-site technical troubleshooting.",
  },
  {
    id: "business-technology",
    key: "IT_MAINTENANCE_SUPPORT",
    title: "Business Technology Solutions",
    icon: ShieldCheck,
    description:
      "POS and billing systems, inventory and sales management, business process digitization, and enterprise technology integration.",
  },
];

export default async function ServicesPage() {
  const allServices = await getActiveServices();

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Modular Page Hero & Category Jump-links */}
      <PageHero
        eyebrow="Corporate Solutions Portfolio"
        title="Enterprise Services Built for Real Business Performance."
        description="We eliminate technical friction by designing, installing, and supporting complete commercial technology ecosystems across Harar, Dire Dawa, and surrounding regional centers."
      >
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold uppercase text-slate-400 mr-2">
            Jump To Category:
          </span>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-ariiti-navy hover:bg-ariiti-navy hover:text-white text-slate-700 text-xs font-semibold transition-all duration-150 shadow-sm"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.title.split("&")[0].trim()}</span>
              </a>
            );
          })}
        </div>
      </PageHero>

      {/* 2. Key Operational Metrics */}
      <TrustMetricsBanner />

      {/* 3. Categorized Services Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {CATEGORIES.map((category) => {
          const matchingServices = allServices.filter(
            (s) => s.category === category.key
          );
          const Icon = category.icon;

          return (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-28 space-y-6"
            >
              <div className="border-b border-slate-200/80 pb-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-ariiti-navy text-white flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-ariiti-navy tracking-tight">
                      {category.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-ariiti-muted max-w-3xl">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>

              {matchingServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {matchingServices.map((service) => (
                    <ServiceCard
                      key={service._id.toString()}
                      service={service}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No active services currently listed in this category"
                  message="We are updating this service catalog. Contact us for custom enterprise requirements."
                />
              )}
            </section>
          );
        })}
      </div>

      {/* 4. Regional SLA & Technician Dispatch Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionalPresence />
      </section>
    </div>
  );
}
