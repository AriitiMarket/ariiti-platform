import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/public/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import TeamCapabilities from "@/components/public/TeamCapabilities";
import RegionalPresence from "@/components/public/RegionalPresence";
import TrustMetricsBanner from "@/components/public/TrustMetricsBanner";
import Button from "@/components/ui/Button";
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  ArrowRight,
  Code2,
  Network,
  Cpu,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Engineering Team & Operational Units | Ariiti Tech",
  description:
    "Meet Ariiti Tech's on-the-ground engineering leads, network architects, and dedicated SLA field technicians stationed in Harar and Dire Dawa.",
};

const TEAM_MEMBERS = [
  {
    name: "Lead Systems Architect",
    role: "Head of Software Engineering & Offline POS",
    department: "Ariiti POS & Commerce Unit",
    bio: "Specializing in local-first browser databases (IndexedDB), distributed data synchronization, and hardware ESC/POS protocol integration for commercial retail operations.",
    location: "Harar Operations Center",
    skills: ["TypeScript", "Next.js App Router", "MongoDB", "IndexedDB", "Hardware APIs"],
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    inquiryTopic: "Software Architecture Consultation",
    inquiryHref: "/contact?category=SOFTWARE_DEVELOPMENT",
  },
  {
    name: "Senior Network Engineer",
    role: "Lead Commercial Cabling & MikroTik Specialist",
    department: "Ariiti Network Infrastructure Unit",
    bio: "Over 8 years deploying Cat6 solid copper infrastructure, multi-floor server racks, MikroTik hardware VLAN routing, and high-density commercial Wi-Fi across Eastern Ethiopia.",
    location: "Dire Dawa Field Office",
    skills: ["Cat6/Cat6A Cabling", "MikroTik RouterOS", "UniFi Enterprise", "Dual-WAN Failover", "Fiber Splicing"],
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    inquiryTopic: "Commercial Network Survey",
    inquiryHref: "/contact?category=NETWORKING_INFRASTRUCTURE",
  },
  {
    name: "Emergency SLA Dispatch Lead",
    role: "Field Maintenance & Technical Operations Coordinator",
    department: "Ariiti Service Desk & SLA Unit",
    bio: "Coordinating rapid on-premise technician dispatches, automated NAS/cloud backup verification, and proactive hardware maintenance contracts throughout Harar and Dire Dawa.",
    location: "Regional 24/7 SLA Hotline",
    skills: ["SLA Incident Management", "Hardware De-dusting", "NAS Backup Audits", "Rapid Troubleshooting"],
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    inquiryTopic: "Emergency SLA Support",
    inquiryHref: "/contact?category=IT_MAINTENANCE_SUPPORT",
  },
];

export default function TeamPage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Page Hero */}
      <PageHero
        eyebrow="Engineering Personnel & Technical Units"
        title="Resident Technical Specialists Stationed On-The-Ground."
        description="Ariiti Tech employs full-time software architects, certified network engineers, and field hardware technicians stationed permanently in Harar and Dire Dawa for direct, on-premise execution."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/contact" variant="primary" size="md" className="font-bold">
            <span>Schedule an Engineering Consultation</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <Button href="/services" variant="outline" size="md" className="font-bold">
            <span>Explore Technical Services</span>
          </Button>
        </div>
      </PageHero>

      {/* 2. Operational Units Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Published Staff Profiles"
          title="Meet Our Operational Team Leaders"
          description="Verified technical leads dedicated to delivering honest, high-durability technology solutions across Eastern Ethiopia."
          align="center"
          className="mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden text-left"
            >
              {/* Photo */}
              <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover object-top hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-mono font-bold uppercase bg-ariiti-accent text-white px-2 py-0.5 rounded">
                    {member.department}
                  </span>
                  <h3 className="text-lg font-bold mt-1 text-white">{member.name}</h3>
                  <p className="text-xs text-slate-300">{member.role}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-ariiti-accent shrink-0" />
                    <span>{member.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Core Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={member.inquiryHref}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-ariiti-navy hover:text-white border border-slate-200 text-xs font-bold text-ariiti-navy transition-colors"
                >
                  <span>Connect with {member.name.split(" ")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Detailed Operational Units */}
      <TeamCapabilities />

      {/* 4. Physical Hubs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionalPresence />
      </div>
    </div>
  );
}
