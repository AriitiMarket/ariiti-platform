import React from "react";
import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import DirectContactChannels from "@/components/public/DirectContactChannels";
import InquiryForm from "@/components/public/InquiryForm";
import {
  getWebsiteSettings,
  getActiveServices,
  getPublishedProducts,
} from "@/lib/queries/publicData";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Compass,
  Building,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Service Inquiry | Ariiti Tech",
  description:
    "Schedule a technology consultation or submit an inquiry for custom software, commercial networking, POS hardware, or IT maintenance in Harar, Dire Dawa, and Eastern Ethiopia.",
};

export const dynamic = "force-dynamic";

interface ContactPageProps {
  searchParams?: {
    category?: string;
    service?: string;
    product?: string;
    caseStudy?: string;
  };
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const [settings, rawServices, rawProducts] = await Promise.all([
    getWebsiteSettings(),
    getActiveServices(),
    getPublishedProducts(),
  ]);

  // Simplify data for client props
  const services = rawServices.map((s) => ({
    id: s._id.toString(),
    title: s.title,
    slug: s.slug,
    category: s.category,
  }));

  const products = rawProducts.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    status: p.status,
  }));

  const initialContext = {
    category: searchParams?.category,
    serviceSlug: searchParams?.service,
    productSlug: searchParams?.product,
    caseStudySlug: searchParams?.caseStudy,
  };

  return (
    <div className="pb-24 space-y-12">
      {/* 1. Header Section */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-ariiti-accent block mb-2">
              Direct Technical Engagement
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-ariiti-navy tracking-tight leading-tight">
              Request a Service or Schedule a Consultation.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-ariiti-muted leading-relaxed">
              Whether you need turnkey structured cabling for a commercial property, a resilient offline POS system, or a prioritized maintenance contract, our operations team in Harar and Dire Dawa is ready to assist.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Consultation Process & Direct Channels (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Consultation Methodology Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-ariiti-accent block mb-2">
                Consultation Process
              </span>
              <h2 className="text-lg font-bold text-ariiti-navy mb-4">
                What Happens After You Inquire:
              </h2>
              <ol className="space-y-4 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-ariiti-navy text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 block">
                      Rapid Requirements Review
                    </strong>
                    <span>
                      An operations architect analyzes your submission and contacts you via phone or WhatsApp within 2–4 hours.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-ariiti-navy text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 block">
                      Site Survey or Technical Scope
                    </strong>
                    <span>
                      For cabling and hardware, our technicians conduct a site assessment in Harar or Dire Dawa to measure cable runs and power lines.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-ariiti-navy text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 block">
                      Fixed Proposal & Implementation
                    </strong>
                    <span>
                      You receive a detailed milestone schedule and transparent pricing with guaranteed warranty coverage.
                    </span>
                  </div>
                </li>
              </ol>
            </div>

            {/* Direct Contact Channels Component */}
            <DirectContactChannels settings={settings} />
          </div>

          {/* Right Column: Interactive Inquiry Form (7 cols on lg) */}
          <div className="lg:col-span-7">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Official Ingestion Gateway
              </span>
              <h2 className="text-2xl font-bold text-ariiti-navy">
                Submit Your Project Details
              </h2>
              <p className="text-xs sm:text-sm text-ariiti-muted mt-1">
                Fill in the technical requirements below. All fields marked with an asterisk (<span className="text-red-500">*</span>) are required.
              </p>
            </div>

            <InquiryForm
              services={services}
              products={products}
              whatsappNumber={settings.whatsappNumber || "251915000000"}
              initialContext={initialContext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
