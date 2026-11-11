import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getServiceBySlug,
  getActiveServices,
  getWebsiteSettings,
} from "@/lib/queries/publicData";
import { buildWhatsAppUrl } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  CheckCircle2,
  AlertCircle,
  Users,
  Layers,
  ArrowRight,
  MessageCircle,
  Phone,
  ChevronLeft,
  Calendar,
  ShieldCheck,
} from "lucide-react";

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} | Ariiti Tech Services`,
    description: service.summary,
  };
}

export default async function SingleServicePage({ params }: ServicePageProps) {
  const [service, settings] = await Promise.all([
    getServiceBySlug(params.slug),
    getWebsiteSettings(),
  ]);

  if (!service) {
    notFound();
  }

  const categoryName = service.category.replace(/_/g, " ");

  const waUrl = buildWhatsAppUrl(settings.whatsappNumber || "251915000000", {
    service: service.title,
    details: `I am interested in scheduling a consultation for: ${service.title}.`,
  });

  return (
    <div className="pb-24 space-y-12">
      {/* 1. Service Hero Header (Deep Navy Blue with White Headings & Text) */}
      <section className="bg-brand-primary text-white border-b border-[#0d3f6d] pt-12 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Back Link */}
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Services</span>
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 uppercase tracking-wide">
                {categoryName}
              </span>
              <span className="text-xs font-semibold text-white/80">
                Guaranteed Regional Warranty &amp; Support
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {service.title}
            </h1>

            <p className="text-base sm:text-xl text-white/85 leading-relaxed max-w-3xl">
              {service.summary}
            </p>

            {/* Quick Action CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                href={`/contact?category=${service.category}&service=${service.slug}`}
                variant="secondary"
                size="lg"
              >
                <span>Request This Service</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                href={waUrl}
                variant="outline"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2 text-emerald-600" />
                <span>Chat via WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Detailed Technical Breakdown (5 Required Pillars) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Pillar 1: What the Service Provides (Detailed Description) */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-ariiti-navy mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-ariiti-accent" />
            <span>What This Service Delivers</span>
          </h2>
          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
            <p className="whitespace-pre-line">{service.description}</p>
          </div>
        </section>

        {/* Pillar 2: Which Problems It Solves */}
        {service.problemsSolved && service.problemsSolved.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-ariiti-navy mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>Operational Problems This Solves</span>
            </h2>
            <p className="text-xs sm:text-sm text-ariiti-muted mb-6">
              Common bottlenecks regional businesses face before engaging Ariiti Tech:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.problemsSolved.map((problem, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs sm:text-sm text-amber-950 flex items-start gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{problem}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pillar 3 & 4: Who Needs It & What Is Included */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 3: Who Needs It */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold text-ariiti-navy mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-ariiti-accent" />
              <span>Target Commercial Sectors</span>
            </h2>
            <p className="text-xs text-ariiti-muted mb-4">
              Organizations that gain immediate operational returns:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed flex-1">
              {service.targetCustomers}
            </div>
          </section>

          {/* Pillar 4: What Is Included (Checklist) */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold text-ariiti-navy mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>What Is Included</span>
            </h2>
            <p className="text-xs text-ariiti-muted mb-4">
              Concrete deliverables guaranteed in our project scope:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {service.whatsIncluded.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Pillar 5: How To Request The Service (Step-by-step engagement process) */}
        <section className="rounded-2xl bg-ariiti-navy text-white p-8 sm:p-12 shadow-lg">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-ariiti-accent block mb-2">
              Engagement Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mb-4">
              How to Request & Deploy This Service
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
              <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                <span className="text-3xl font-black text-ariiti-accent block mb-2">
                  1
                </span>
                <h3 className="font-bold text-sm mb-1">Submit Inquiry</h3>
                <p className="text-xs text-slate-300">
                  Send your project requirements or WhatsApp our engineering team.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                <span className="text-3xl font-black text-ariiti-accent block mb-2">
                  2
                </span>
                <h3 className="font-bold text-sm mb-1">Site Assessment</h3>
                <p className="text-xs text-slate-300">
                  We audit your facility in Harar or Dire Dawa and provide a fixed quote.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                <span className="text-3xl font-black text-ariiti-accent block mb-2">
                  3
                </span>
                <h3 className="font-bold text-sm mb-1">Deploy & Support</h3>
                <p className="text-xs text-slate-300">
                  Turnkey installation, staff training, and ongoing warranty SLA activation.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                href={`/contact?category=${service.category}&service=${service.slug}`}
                variant="accent"
                size="lg"
              >
                <span>Proceed to Service Request Form</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                href={waUrl}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2 text-emerald-400" />
                <span>Discuss on WhatsApp</span>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
