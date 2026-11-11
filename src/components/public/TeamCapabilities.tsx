import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Cpu,
  Network,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle2,
  HardDrive,
  Users2,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import connectDB from "@/lib/mongodb";
import TeamSquad from "@/models/TeamSquad";

export interface OperationalUnit {
  id: string;
  unitName: string;
  designation: string;
  specialization: string;
  overview?: string;
  dispatchHubs: string;
  keyCompetencies: string[];
  imageUrl: string;
  ctaText?: string;
  ctaHref?: string;
}

const FALLBACK_UNITS: OperationalUnit[] = [
  {
    id: "pos-unit",
    unitName: "Ariiti POS & Commerce Engineering Unit",
    designation: "Retail Systems & Peripheral Integration",
    specialization: "Offline-First Sync, ESC/POS Protocols, Touch Hardware",
    overview:
      "Specialized in deploying high-throughput point-of-sale infrastructure for supermarkets, pharmacies, and wholesale distribution centers across Harar and Dire Dawa. Guarantees 0ms local checkout latency even during complete internet blackouts.",
    dispatchHubs: "Stationed at Harar Hub & Dire Dawa Center",
    keyCompetencies: [
      "Local-first indexed database architecture",
      "Thermal printer & barcode hardware calibration",
      "Cash drawer RJ11 electrical surge isolation",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
    ctaText: "Inquire on POS Deployment",
    ctaHref: "/contact?category=HARDWARE_EQUIPMENT",
  },
  {
    id: "network-unit",
    unitName: "Ariiti Network Infrastructure & Cabling Unit",
    designation: "Commercial Structured Cabling & Routing",
    specialization: "Cat6/Cat6A Solid Copper, MikroTik CCR, Dual-WAN",
    overview:
      "Engineers certified structured copper backbones, organized 19-inch 12U/24U server rack deployments, and high-density UniFi access point arrays for commercial complexes, multi-floor hotels, and institutional campuses.",
    dispatchHubs: "Dire Dawa Field Office & Harar Dispatch",
    keyCompetencies: [
      "Fluke-certified Cat6 structured terminations",
      "MikroTik hardware-accelerated VLAN routing",
      "Automated dual-ISP fiber & 4G failover",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    ctaText: "Schedule Site Survey",
    ctaHref: "/contact?category=NETWORKING_INFRASTRUCTURE",
  },
  {
    id: "service-desk",
    unitName: "Ariiti Service Desk & Emergency SLA Operations",
    designation: "Rapid On-Site Support & Preventive Care",
    specialization: "Contractual <2-Hour Dispatch, NAS Backups, Cleaning",
    overview:
      "Delivering dependable technical peace of mind. Provides rapid on-premise emergency response for critical system halts, automated verified daily database backups, and scheduled monthly hardware de-dusting.",
    dispatchHubs: "24/7 Priority Emergency SLA Hotline",
    keyCompetencies: [
      "Guaranteed <2-hour on-premise incident arrival",
      "Automated daily local NAS & cloud backups",
      "Preventive dust & thermal paste overhaul",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
    ctaText: "Request SLA Support Agreement",
    ctaHref: "/contact?category=IT_MAINTENANCE_SUPPORT",
  },
];

interface TeamCapabilitiesProps {
  squads?: OperationalUnit[];
}

export const TeamCapabilities: React.FC<TeamCapabilitiesProps> = async ({
  squads: propSquads,
}) => {
  let units: OperationalUnit[] = propSquads || [];

  if (!units || units.length === 0) {
    try {
      await connectDB();
      const dbSquads = await TeamSquad.find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .lean();

      if (dbSquads && dbSquads.length > 0) {
        units = dbSquads.map((s: any) => ({
          id: s._id.toString(),
          unitName: s.unitName,
          designation: s.designation,
          specialization: s.specialization,
          overview: s.overview || "",
          dispatchHubs: s.dispatchHubs,
          keyCompetencies: s.keyCompetencies || [],
          imageUrl: s.imageUrl || "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
          ctaText: s.ctaText || "Inquire on Engineering",
          ctaHref: s.ctaHref || "/contact",
        }));
      }
    } catch {
      units = FALLBACK_UNITS;
    }
  }

  if (units.length === 0) {
    units = FALLBACK_UNITS;
  }

  return (
    <section className="bg-white py-16 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Dedicated Technical Units"
          title="On-The-Ground Engineering & Service Personnel"
          description="Ariiti Tech maintains resident technical divisions with verified engineering specializations stationed permanently in Harar and Dire Dawa for direct on-premise execution."
          align="center"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden text-left group justify-between"
            >
              <div>
                {/* Unit Cover Image */}
                <div className="relative h-48 w-full bg-[#093053] overflow-hidden">
                  <Image
                    src={unit.imageUrl}
                    alt={unit.unitName}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#093053]/90 via-[#093053]/30 to-transparent" />

                  {/* Floating Unit Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-bold text-[11px] bg-[#093053]/90 px-2.5 py-1 rounded border border-white/20 backdrop-blur-sm truncate">
                      {unit.designation}
                    </span>
                  </div>
                </div>

                {/* Unit Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-brand-primary mb-1 tracking-tight">
                    {unit.unitName}
                  </h3>
                  <p className="text-xs font-semibold text-brand-primary mb-3">
                    {unit.specialization}
                  </p>
                  {unit.overview && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {unit.overview}
                    </p>
                  )}

                  {/* Location badge */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                    <span className="font-medium text-[11px] truncate">
                      {unit.dispatchHubs}
                    </span>
                  </div>

                  {/* Competency bullets */}
                  <div className="space-y-1.5 mb-6">
                    {unit.keyCompetencies.map((comp, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700">{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card CTA */}
              <div className="p-6 pt-0">
                <Link
                  href={unit.ctaHref || "/contact"}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-brand-primary hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
                >
                  <span>{unit.ctaText || "Inquire on Engineering"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamCapabilities;
