import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Code2,
  Network,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Zap,
  Server,
  Layers,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface DivisionItem {
  id: string;
  categoryTag: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  technicalHighlights: { label: string; value: string }[];
  imageUrl: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  learnMoreHref: string;
  requestServiceHref: string;
}

const DIVISIONS: DivisionItem[] = [
  {
    id: "software",
    categoryTag: "Division 01 • Systems Engineering",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    title: "Enterprise Software & Business Applications",
    subtitle: "Built to withstand intermittent telecom and power cuts.",
    description:
      "We design and build bespoke business applications engineered specifically for the regional commercial dynamics of Eastern Ethiopia. From offline-first retail billing engines to multi-branch warehouse synchronization, our software platforms guarantee that your transactions and staff operations never freeze.",
    capabilities: [
      "Offline-first client architecture with zero-latency checkout",
      "Cryptographic automated cloud synchronization on link recovery",
      "Granular role-based staff permissions and shift reconciliation",
      "Multi-branch inventory tracking across Harar and Dire Dawa hubs",
    ],
    technicalHighlights: [
      { label: "Offline Storage", value: "IndexedDB / SQLite" },
      { label: "Sync Latency", value: "<500ms on Recovery" },
      { label: "Export Formats", value: "PDF, Excel & Raw CSV" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Enterprise software dashboard and business analytics interface",
    imagePosition: "right",
    learnMoreHref: "/services/custom-software-development",
    requestServiceHref: "/contact?category=SOFTWARE_DEVELOPMENT",
  },
  {
    id: "networking",
    categoryTag: "Division 02 • Certified Infrastructure",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "Commercial Networking & Structured Cabling",
    subtitle: "Turnkey Cat6/Cat6A and dual-WAN enterprise routing.",
    description:
      "A slow or unstable network starves business productivity. Ariiti Tech engineers certified structured cabling, installs organized wall/floor server cabinets, and configures carrier-grade MikroTik CCR routers with automated Ethio Telecom fiber and 4G backup failover.",
    capabilities: [
      "Cat6/Cat6A pure copper cabling with patch panel terminations",
      "12U/24U organized server rack dressing and UPS integration",
      "High-density ceiling access points with seamless multi-floor roaming",
      "VLAN segmentation separating guest Wi-Fi from secure office accounting",
    ],
    technicalHighlights: [
      { label: "Bandwidth Backbone", value: "10 Gbps SFP+" },
      { label: "Failover Speed", value: "1.5s Auto-Switch" },
      { label: "Device Capacity", value: "150+ Concurrent" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Organized server rack and structured Cat6 network installation",
    imagePosition: "left",
    learnMoreHref: "/services/networking-it-infrastructure",
    requestServiceHref: "/contact?category=NETWORKING_INFRASTRUCTURE",
  },
  {
    id: "hardware",
    categoryTag: "Division 03 • Commercial Equipment",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    title: "POS Hardware & Retail Equipment Integration",
    subtitle: "Heavy-duty commercial peripherals with local spare parts.",
    description:
      "Avoid expensive downtime caused by delicate consumer-grade hardware. We supply, configure, and service industrial touch POS terminals, 80mm high-speed ESC/POS receipt printers, 2D QR scanners, and surge-protected cash drawers—backed by a comprehensive local replacement warranty.",
    capabilities: [
      "IP54 spill and dust-resistant capacitive touch POS terminals",
      "250mm/s auto-cutter thermal receipt printers with LAN/USB support",
      "Omnidirectional hands-free 1D/2D barcode scanners",
      "Heavy-gauge steel RJ11 cash drawers with emergency manual key release",
    ],
    technicalHighlights: [
      { label: "Print Cutter Life", value: "1.5 Million Cuts" },
      { label: "Touch Durability", value: "50M Touch Cycles" },
      { label: "Local Spares", value: "Direct in Harar/DD" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Retail point of sale terminal with thermal printer and scanner",
    imagePosition: "right",
    learnMoreHref: "/services/pos-hardware-equipment",
    requestServiceHref: "/contact?category=HARDWARE_EQUIPMENT",
  },
  {
    id: "maintenance",
    categoryTag: "Division 04 • SLA Operations",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    title: "Preventive IT Maintenance & 2-Hour SLA Support",
    subtitle: "Guaranteed on-site emergency dispatch in Harar and Dire Dawa.",
    description:
      "Protect your IT capital investments with proactive maintenance. Our corporate maintenance agreements include monthly hardware compressor cleaning, thermal paste refresh, automated NAS/cloud database backups, and contractual 2-hour on-premise emergency dispatch during critical outages.",
    capabilities: [
      "Monthly on-premise compressor cleaning preventing thermal throttling",
      "Automated dual-target encrypted daily database backup auditing",
      "OS security patch management and commercial antivirus enforcement",
      "Guaranteed prioritized on-site arrival within 2 hours for critical incidents",
    ],
    technicalHighlights: [
      { label: "Emergency SLA", value: "<2 Hours On-Site" },
      { label: "Backup Integrity", value: "Daily Verification" },
      { label: "Support Radius", value: "Harar & Dire Dawa" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Certified IT technician performing preventive maintenance on server equipment",
    imagePosition: "left",
    learnMoreHref: "/services/it-maintenance-support",
    requestServiceHref: "/contact?category=IT_MAINTENANCE_SUPPORT",
  },
];

export const ServiceDivisionShowcase: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 space-y-16 sm:space-y-24">
      {DIVISIONS.map((division, idx) => {
        const isImageLeft = division.imagePosition === "left";

        return (
          <div
            key={division.id}
            id={division.id}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Image Column */}
              <div
                className={`lg:col-span-6 ${
                  isImageLeft ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 aspect-[4/3] bg-slate-900 group">
                  <Image
                    src={division.imageUrl}
                    alt={division.imageAlt}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Floating Overlay Pill */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg font-mono font-semibold">
                      ARIITI FIELD SPECIFICATION
                    </span>
                    <span className="bg-ariiti-accent text-white px-2.5 py-1 rounded-md font-bold text-[11px]">
                      VERIFIED ENGINEERING
                    </span>
                  </div>
                </div>
              </div>

              {/* Text / Capabilities Column */}
              <div
                className={`lg:col-span-6 flex flex-col justify-center text-left ${
                  isImageLeft ? "lg:order-2" : "lg:order-1"
                }`}
              >
                {/* Category Pill */}
                <div className="mb-3">
                  <span
                    className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${division.badgeColor}`}
                  >
                    {division.categoryTag}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl sm:text-3xl font-black text-ariiti-navy tracking-tight leading-tight mb-2">
                  {division.title}
                </h3>
                <p className="text-sm sm:text-base font-semibold text-ariiti-accent mb-4">
                  {division.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {division.description}
                </p>

                {/* Key Capabilities Checklist */}
                <div className="space-y-2.5 mb-6">
                  {division.capabilities.map((cap, capIdx) => (
                    <div key={capIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-700 font-medium">
                        {cap}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Technical Highlights Chips */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-6">
                  {division.technicalHighlights.map((th, thIdx) => (
                    <div key={thIdx} className="text-left">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase truncate">
                        {th.label}
                      </p>
                      <p className="text-xs font-bold text-ariiti-navy truncate">
                        {th.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    href={division.requestServiceHref}
                    variant="primary"
                    size="sm"
                    className="font-bold"
                  >
                    <span>Request Service Consultation</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    href={division.learnMoreHref}
                    variant="outline"
                    size="sm"
                    className="font-semibold"
                  >
                    <span>Detailed Scope</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ServiceDivisionShowcase;
