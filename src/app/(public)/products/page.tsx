import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/public/PageHero";
import ProductCard from "@/components/public/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import TrustMetricsBanner from "@/components/public/TrustMetricsBanner";
import RegionalPresence from "@/components/public/RegionalPresence";
import { getPublishedProducts } from "@/lib/queries/publicData";
import { Layers, ShieldCheck, Check, Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Proprietary Software Products Ecosystem",
  description:
    "Explore Ariiti Tech's proprietary software products—including Ariiti POS, Ariiti Service Desk, Ariiti Network Manager, and Ariiti Inventory Sync—engineered for Eastern Ethiopian enterprises.",
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getPublishedProducts();

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Modular Page Hero */}
      <PageHero
        eyebrow="Software Product Ecosystem"
        title="Specialized Software Built for Regional Commercial Resilience."
        description="As a parent technology enterprise, Ariiti Tech designs, incubates, and supports specialized commercial software applications tailored to Eastern Ethiopia’s connectivity and operational environments."
      >
        {/* Status Transparency Standards Legend */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2.5">
            Product Lifecycle & Transparency Standards:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Available</p>
                <p className="text-[11px] text-slate-500">Live production software ready for commercial business licensing.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="font-bold text-slate-800">Beta Testing</p>
                <p className="text-[11px] text-slate-500">Active pilot installations in partner retail/hotel locations in Harar & Dire Dawa.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">In Development</p>
                <p className="text-[11px] text-slate-500">Active software roadmap. Accepting advance pilot partner inquiries.</p>
              </div>
            </div>
          </div>
        </div>
      </PageHero>

      {/* 2. Key Operational Metrics Strip */}
      <TrustMetricsBanner />

      {/* 3. Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Software Products Updating"
            message="Our engineering team is currently synchronizing software product records. Please check back shortly or contact our team directly."
            actionText="Inquire About Software Solutions"
            actionHref="/contact?category=PRODUCT_INQUIRY"
          />
        )}
      </section>

      {/* 4. Custom Software Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-ariiti-navy mb-3">
            Need a Proprietary System Tailored to Your Specific Workflows?
          </h2>
          <p className="text-ariiti-muted text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Beyond our proprietary software products, we engineer bespoke web portals,
            automated databases, and multi-branch inventory solutions for regional
            distributors and hospitality providers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="/contact?category=SOFTWARE_DEVELOPMENT"
              variant="primary"
              size="lg"
              className="font-bold shadow-sm"
            >
              <span>Schedule Architecture Blueprinting</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              href="/portfolio?category=SOFTWARE_DEVELOPMENT"
              variant="outline"
              size="lg"
              className="font-bold"
            >
              <span>View Software Deployments</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Regional Presence Hubs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionalPresence />
      </section>
    </div>
  );
}
