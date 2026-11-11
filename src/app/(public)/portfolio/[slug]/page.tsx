import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCaseStudyBySlug,
  getWebsiteSettings,
} from "@/lib/queries/publicData";
import { buildWhatsAppUrl } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  ChevronLeft,
  MapPin,
  Building,
  Shield,
  Layers,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ArrowRight,
  MessageCircle,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const caseStudy = await getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: `${caseStudy.title} | Case Studies | Ariiti Tech`,
    description: caseStudy.summary,
  };
}

export default async function SingleCaseStudyPage({
  params,
}: CaseStudyPageProps) {
  const [caseStudy, settings] = await Promise.all([
    getCaseStudyBySlug(params.slug),
    getWebsiteSettings(),
  ]);

  if (!caseStudy) {
    notFound();
  }

  const clientDisplayName = caseStudy.isClientConfidential
    ? `Confidential ${caseStudy.clientSector} Client`
    : caseStudy.clientName || `${caseStudy.clientSector} Client`;

  const categoryName = caseStudy.category.replace(/_/g, " ");

  const waUrl = buildWhatsAppUrl(settings.whatsappNumber || "251915000000", {
    service: caseStudy.title,
    details: `I saw your case study '${caseStudy.title}' and would like to discuss a similar deployment for my business.`,
  });

  return (
    <div className="pb-24 space-y-12">
      {/* 1. Header Hero Banner (Deep Navy Blue with White Headings & Text) */}
      <section className="bg-brand-primary text-white border-b border-[#0d3f6d] pt-12 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Back Link */}
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Case Studies</span>
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 uppercase tracking-wide">
                {categoryName}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                {caseStudy.projectStatus.replace(/_/g, " ")}
              </span>
              <span className="text-xs font-medium text-white/85 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-white/80" />
                {caseStudy.location}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {caseStudy.title}
            </h1>

            <p className="text-base sm:text-xl text-white/85 leading-relaxed max-w-3xl">
              {caseStudy.summary}
            </p>

            {/* Client NDA Meta Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-white/80 border-t border-white/15">
              <div className="flex items-center gap-1.5">
                {caseStudy.isClientConfidential ? (
                  <>
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>
                      Client: <strong className="text-white">{clientDisplayName}</strong> (Protected by NDA)
                    </span>
                  </>
                ) : (
                  <>
                    <Building className="w-4 h-4 text-white/70" />
                    <span>
                      Client: <strong className="text-white">{clientDisplayName}</strong>
                    </span>
                  </>
                )}
              </div>

              <div>
                Sector: <strong className="text-white">{caseStudy.clientSector}</strong>
              </div>

              {caseStudy.completedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Delivered:{" "}
                    {new Date(caseStudy.completedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Cover / Featured Image */}
        {caseStudy.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm max-h-[440px] w-full bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={caseStudy.coverImageUrl}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Addressed */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-ariiti-navy mb-3">
              The Operational Problem
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {caseStudy.problemAddressed}
            </p>
          </section>

          {/* Solution Implemented */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-ariiti-navy mb-3">
              The Engineering Solution
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {caseStudy.solutionImplemented}
            </p>
          </section>
        </div>

        {/* Technologies & Equipment Used */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-sm">
          <h2 className="text-xl font-bold text-ariiti-navy mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-ariiti-accent" />
            <span>Technologies & Commercial Equipment Deployed</span>
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {caseStudy.technologiesAndEquipment.map((tech, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Measurable Outcomes */}
        {caseStudy.measurableOutcomes && caseStudy.measurableOutcomes.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-sm">
            <h2 className="text-xl font-bold text-ariiti-navy mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Measurable Business & Technical Outcomes</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseStudy.measurableOutcomes.map((outcome, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 text-xs sm:text-sm text-emerald-950 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{outcome}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Screenshots (if any) */}
        {caseStudy.galleryImageUrls && caseStudy.galleryImageUrls.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-sm">
            <h2 className="text-xl font-bold text-ariiti-navy mb-6">
              Deployment Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {caseStudy.galleryImageUrls.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-slate-200 h-64 bg-slate-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`${caseStudy.title} screenshot ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Bottom Contextual CTA Banner */}
        <section className="rounded-2xl bg-ariiti-navy text-white p-8 sm:p-12 shadow-lg">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-ariiti-accent block mb-2">
              Corporate Replication & Consultation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mb-4">
              Need a Similar Solution for Your Business?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Ariiti Tech deploys tailored software systems, commercial LAN infrastructure, and POS hardware for enterprises across Harar, Dire Dawa, and Eastern Ethiopia.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                href={`/contact?caseStudy=${caseStudy.slug}&category=${caseStudy.category}`}
                variant="accent"
                size="lg"
              >
                <span>Request a Quote for Similar Project</span>
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
                <span>Consult on WhatsApp</span>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
