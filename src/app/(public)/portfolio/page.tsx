import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/public/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import CaseStudyCard from "@/components/public/CaseStudyCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import TrustMetricsBanner from "@/components/public/TrustMetricsBanner";
import RegionalPresence from "@/components/public/RegionalPresence";
import { getPublishedCaseStudies } from "@/lib/queries/publicData";
import { cn } from "@/lib/utils";
import { Shield, CheckCircle, ArrowRight, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Corporate B2B Case Studies & Project Directory",
  description:
    "Explore Ariiti Tech's portfolio of completed software deployments, structured Cat6 cabling, and commercial Wi-Fi infrastructure projects across Eastern Ethiopia.",
};

export const dynamic = "force-dynamic";

const FILTER_TABS = [
  { label: "All Deployments", value: "ALL" },
  { label: "Software Systems", value: "SOFTWARE_DEVELOPMENT" },
  { label: "Networking & LAN", value: "NETWORKING_INFRASTRUCTURE" },
  { label: "POS Hardware", value: "HARDWARE_EQUIPMENT" },
  { label: "IT Maintenance", value: "IT_MAINTENANCE_SUPPORT" },
];

interface PortfolioPageProps {
  searchParams?: {
    category?: string;
  };
}

export default async function PortfolioPage({
  searchParams,
}: PortfolioPageProps) {
  const selectedCategory = searchParams?.category || "ALL";

  const caseStudies = await getPublishedCaseStudies({
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
  });

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Modular Page Hero */}
      <PageHero
        eyebrow="Corporate Portfolio & Technical Demonstrations"
        title="Real-World Deployments. Verifiable Engineering."
        description="Browse our directory of live business software deployments, turnkey commercial network installations, and hardware setups across Harar, Dire Dawa, and Eastern Ethiopia."
      >
        {/* NDA Privacy Disclosure Strip */}
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/80 border border-slate-200 rounded-xl p-3 max-w-2xl shadow-sm mb-6">
          <Shield className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Client Privacy Notice:</strong> In compliance with corporate non-disclosure agreements (NDAs), certain commercial client identities are anonymized while preserving architectural accuracy.
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_TABS.map((tab) => {
            const isActive = selectedCategory === tab.value;
            return (
              <Link
                key={tab.value}
                href={
                  tab.value === "ALL"
                    ? "/portfolio"
                    : `/portfolio?category=${tab.value}`
                }
                className={cn(
                  "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 shadow-sm",
                  isActive
                    ? "bg-ariiti-navy text-white shadow-md"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-ariiti-navy"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </PageHero>

      {/* 2. Key Operational Proof Metrics */}
      <TrustMetricsBanner />

      {/* 3. Case Studies Grid with Instant Quick Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {caseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard
                key={caseStudy._id.toString()}
                caseStudy={caseStudy}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No case studies found in this category"
            message="We are continuously cataloging technical deployments. Select another filter or contact us for private reference blueprints."
            actionText="View All Deployments"
            actionHref="/portfolio"
          />
        )}
      </section>

      {/* 4. Need a Custom Deployment CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionalPresence />
      </section>
    </div>
  );
}
