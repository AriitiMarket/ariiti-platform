import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductBySlug, getPublishedProducts } from "@/lib/queries/publicData";
import Badge, { BadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/public/ProductCard";
import TrustMetricsBanner from "@/components/public/TrustMetricsBanner";
import RegionalPresence from "@/components/public/RegionalPresence";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  Cpu,
  Zap,
  Users,
  Box,
  FileText,
} from "lucide-react";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

const STATUS_META: Record<
  string,
  { label: string; variant: BadgeVariant; helperText: string }
> = {
  AVAILABLE: {
    label: "Available",
    variant: "available",
    helperText: "Live commercial production software ready for business deployment.",
  },
  TESTING: {
    label: "Beta Testing",
    variant: "testing",
    helperText: "Pilot testing in active partner commercial environments in Eastern Ethiopia.",
  },
  IN_DEVELOPMENT: {
    label: "In Development",
    variant: "development",
    helperText: "Active software engineering roadmap. Accepting early partner inquiries.",
  },
  TEMPORARILY_UNAVAILABLE: {
    label: "Temporarily Unavailable",
    variant: "unavailable",
    helperText: "Under scheduled maintenance or platform revision.",
  },
  DISCONTINUED: {
    label: "Discontinued",
    variant: "neutral",
    helperText: "Archived release.",
  },
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product Not Found | Ariiti Tech" };
  }
  return {
    title: `${product.name} | Ariiti Tech Products`,
    description: product.tagline || product.description,
  };
}

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const [product, allProducts] = await Promise.all([
    getProductBySlug(params.slug),
    getPublishedProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const statusInfo = STATUS_META[product.status] || {
    label: product.status,
    variant: "neutral",
    helperText: "",
  };

  const otherProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const hasLiveDemo = Boolean(product.accessOrDemoUrl);

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Product Hero Banner (Deep Navy Background with White Typography) */}
      <div className="bg-[#093053] text-white pt-8 pb-14 sm:pb-20 border-b border-[#07243e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products & Solutions</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-white/15 text-white text-xs font-mono font-bold uppercase px-3 py-1 rounded-md border border-white/25">
                  Ariiti Tech Product
                </span>
                <Badge variant={statusInfo.variant} withDot={true}>
                  {statusInfo.label}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-base sm:text-xl text-white/90 font-medium leading-relaxed max-w-2xl">
                {product.tagline}
              </p>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-3xl">
                {product.description}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3.5">
                {hasLiveDemo ? (
                  <Button
                    href={product.accessOrDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                    className="font-bold bg-white text-[#093053] hover:bg-slate-100 shadow-md"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink className="w-4 h-4 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    href={`/contact?category=PRODUCT_INQUIRY&product=${product.slug}`}
                    variant="primary"
                    size="md"
                    className="font-bold bg-white text-[#093053] hover:bg-slate-100 shadow-md"
                  >
                    <span>Request a Demo</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                )}

                <Button
                  href={`/contact?category=PRODUCT_INQUIRY&product=${product.slug}`}
                  variant="outline"
                  size="md"
                  className="font-bold border-2 border-white text-white hover:bg-white hover:text-[#093053]"
                >
                  <span>Inquire About Pricing & Licensing</span>
                </Button>
              </div>
            </div>

            {/* Right Card: Lifecycle & Version Info */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/70">
                Deployment Telemetry
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-white/60 block mb-0.5">Availability Status:</span>
                  <p className="font-bold text-white text-sm">{statusInfo.label}</p>
                  <p className="text-[11px] text-white/75 mt-0.5">{statusInfo.helperText}</p>
                </div>

                {product.targetCustomers && (
                  <div className="pt-2 border-t border-white/15">
                    <span className="text-white/60 block mb-0.5">Target Customers:</span>
                    <p className="text-white/90">{product.targetCustomers}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-white/15">
                  <span className="text-white/60 block mb-0.5">Regional Availability:</span>
                  <p className="font-bold text-white">Harar, Dire Dawa & Eastern Ethiopia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Detailed Technical Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Left Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Problem It Solves */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-sm text-left">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#093053]" />
                <h2 className="text-xl font-bold text-[#093053] tracking-tight">
                  Problem It Solves
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Operating commercial systems in Eastern Ethiopia often suffers from erratic
                network connectivity, slow hardware integration, and generic off-the-shelf software
                that freezes during telecom disruptions. {product.name} is architected
                specifically to operate with local-first offline resilience, eliminating
                transaction stalls and operational paralysis.
              </p>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-sm text-left">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-[#093053]" />
                <h2 className="text-xl font-bold text-[#093053] tracking-tight">
                  How It Works
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p>
                  Built with a modern micro-client architecture, {product.name} uses
                  secure local data storage that continues recording operational transactions,
                  receipts, and inventory movements without requiring a live cloud link.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200">
                    <span className="text-xs font-bold text-[#093053] block mb-1">
                      1. Local Processing
                    </span>
                    <p className="text-xs text-slate-600">
                      Transactions execute instantly with 0ms local latency.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200">
                    <span className="text-xs font-bold text-[#093053] block mb-1">
                      2. Offline Resilience
                    </span>
                    <p className="text-xs text-slate-600">
                      Receipts and records save locally during telecom cuts.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200">
                    <span className="text-xs font-bold text-[#093053] block mb-1">
                      3. Automatic Sync
                    </span>
                    <p className="text-xs text-slate-600">
                      Cryptographic background synchronization upon link restore.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Features */}
            {product.mainFeatures && product.mainFeatures.length > 0 && (
              <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-sm text-left">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#093053]" />
                  <h2 className="text-xl font-bold text-[#093053] tracking-tight">
                    Key Architectural Features
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.mainFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200/80 flex items-start gap-3"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-800 leading-snug font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Target Customers */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-left space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#093053]" />
                <h3 className="font-bold text-[#093053] text-sm uppercase tracking-wider">
                  Target Deployments
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.targetCustomers ||
                  "Supermarkets, retail pharmacies, boutique hotels, wholesale logistics firms, and commercial complexes."}
              </p>
            </div>

            {/* Request a Demo CTA Card */}
            <div className="bg-[#093053] text-white rounded-2xl p-6 border border-[#07243e] shadow-md text-left space-y-4">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Interested in {product.name}?
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Schedule a live technical walkthrough or request a pilot deployment trial for
                your establishment in Harar or Dire Dawa.
              </p>
              <Button
                href={`/contact?category=PRODUCT_INQUIRY&product=${product.slug}`}
                variant="primary"
                size="md"
                className="w-full bg-white text-[#093053] hover:bg-slate-100 font-bold justify-center"
              >
                <span>Request a Demo</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Other Products in the Ecosystem */}
      {otherProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#093053] tracking-tight">
                More Ariiti Products &amp; Solutions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Explore specialized commercial software built for Eastern Ethiopian business needs.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#093053] hover:underline inline-flex items-center gap-1"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProducts.map((p) => (
              <ProductCard key={p._id.toString()} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Trust & Regional Presence */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionalPresence />
      </div>
    </div>
  );
}
