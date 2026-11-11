import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/public/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import TrustMetricsBanner from "@/components/public/TrustMetricsBanner";
import TeamCapabilities from "@/components/public/TeamCapabilities";
import RegionalPresence from "@/components/public/RegionalPresence";
import Button from "@/components/ui/Button";
import {
  Target,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Users2,
  ArrowRight,
  MapPin,
  Building2,
  Layers,
  Wrench,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Corporate Overview & Mission",
  description:
    "Learn about Ariiti Tech's corporate mission, values, and practical approach to software engineering and commercial IT infrastructure across Eastern Ethiopia.",
};

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. Modular Page Hero */}
      <PageHero
        eyebrow="Corporate Background & Mandate"
        title="Bridging Modern Technology with Everyday Business Operations."
        description="Ariiti Tech is an enterprise technology provider operating in Harar, Dire Dawa, and surrounding regional commercial centers. We solve real operational bottlenecks through custom software development, commercial networking, POS equipment integration, and proactive maintenance contracts."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/services" variant="primary" size="md" className="font-bold">
            <span>Explore Enterprise Services</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <Button href="/portfolio" variant="outline" size="md" className="font-bold">
            <span>Inspect Verified Case Studies</span>
          </Button>
        </div>
      </PageHero>

      {/* 2. Key Operational Metrics Strip */}
      <TrustMetricsBanner />

      {/* 3. Vision & Mission Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-ariiti-navy/5 text-ariiti-navy flex items-center justify-center mb-6">
              <Compass className="w-6 h-6 text-ariiti-accent" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-ariiti-accent block mb-1">
              Our Vision
            </span>
            <h2 className="text-2xl font-bold text-ariiti-navy mb-4">
              Regional Technological Empowerment
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              To be the most trusted technology solutions provider in Eastern Ethiopia, empowering commercial enterprises with dependable digital systems, resilient IT infrastructure, and prompt technical support.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-ariiti-navy/5 text-ariiti-navy flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-ariiti-accent" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-ariiti-accent block mb-1">
              Our Mission
            </span>
            <h2 className="text-2xl font-bold text-ariiti-navy mb-4">
              Practical & Reliable Delivery
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              To bridge the regional gap between complex technology and everyday business operations by delivering practical software products, commercial networking, and proactive technical services tailored to Eastern Ethiopian enterprises.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Foundational Principles"
          title="The Values That Guide Every Deployment"
          description="We measure our success not by abstract vanity metrics, but by the tangible operational uptime and efficiency gained by our corporate clients."
          align="center"
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm text-left">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ariiti-navy mb-2">Practicality</h3>
            <p className="text-xs sm:text-sm text-ariiti-muted leading-relaxed">
              We never recommend over-complicated software or unnecessary hardware. Every recommendation directly solves an identified business pain point.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ariiti-navy mb-2">
              Reliability & Integrity
            </h3>
            <p className="text-xs sm:text-sm text-ariiti-muted leading-relaxed">
              We communicate transparently regarding software development roadmaps and use honest equipment specs—standing behind our warranties.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ariiti-navy mb-2">
              Technical Excellence
            </h3>
            <p className="text-xs sm:text-sm text-ariiti-muted leading-relaxed">
              From clean TypeScript and relational schema design to certified Cat6 cabling and MikroTik VLAN tagging, our craftsmanship is engineered to last.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm text-left">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ariiti-navy mb-2">
              Long-Term Partnership
            </h3>
            <p className="text-xs sm:text-sm text-ariiti-muted leading-relaxed">
              Technology requires ongoing care. We build enduring client relationships with on-site staff training, regular backup audits, and SLA dispatches.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Dedicated Operational Units & Field Specialists */}
      <TeamCapabilities />

      {/* 6. Regional Presence & Physical Infrastructure Hubs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionalPresence />
      </section>
    </div>
  );
}
