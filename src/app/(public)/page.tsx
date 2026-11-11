import React from "react";
import Link from "next/link";
import HeroSection from "@/components/public/HeroSection";
import CompanyIntroSection from "@/components/public/CompanyIntroSection";
import SectionHeader from "@/components/ui/SectionHeader";
import ServiceCard from "@/components/public/ServiceCard";
import ServiceDivisionShowcase from "@/components/public/ServiceDivisionShowcase";
import WhyChooseUs from "@/components/public/WhyChooseUs";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import TeamCapabilities from "@/components/public/TeamCapabilities";
import ProductCard from "@/components/public/ProductCard";
import CaseStudyCard from "@/components/public/CaseStudyCard";
import TrustMetricsBanner from "@/components/public/TrustMetricsBanner";
import RegionalPresence from "@/components/public/RegionalPresence";
import Button from "@/components/ui/Button";
import {
  getActiveServices,
  getPublishedProducts,
  getPublishedCaseStudies,
  getWebsiteSettings,
  getPublishedTestimonials,
} from "@/lib/queries/publicData";
import {
  Code2,
  Network,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  PhoneCall,
  MessageCircle,
} from "lucide-react";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  const [services, products, caseStudies, settings, testimonials] = await Promise.all([
    getActiveServices(),
    getPublishedProducts(),
    getPublishedCaseStudies({ featuredOnly: true }),
    getWebsiteSettings(),
    getPublishedTestimonials(),
  ]);

  return (
    <div className="space-y-10 sm:space-y-16 pb-16">
      {/* 1. Hero Section with Motion Design Banner Slider */}
      <HeroSection />

      {/* 2. Short Company Introduction with 4 Primary Action Buttons */}
      <CompanyIntroSection />

      {/* 3. Key Operational Performance & Trust Metrics */}
      <TrustMetricsBanner />

      {/* 4. Core Services & Technology Divisions ("What We Do") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What We Do"
          title="Enterprise Technology & Infrastructure Divisions"
          description="Delivering reliable technology solutions, enterprise infrastructure, and specialized technical services to support businesses and institutions across Eastern Ethiopia."
          align="center"
          className="mb-10"
        />

        {/* 4 Divisions Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-ariiti-accent hover:shadow-md transition-all duration-200 text-left">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-ariiti-accent flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ariiti-navy mb-1.5 text-base">
              Software Systems
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Custom business web portals, offline-first cashier systems, and automated operations databases.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-ariiti-accent hover:shadow-md transition-all duration-200 text-left">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ariiti-navy mb-1.5 text-base">
              Commercial Networking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cat6 structured cabling, server racks, MikroTik routing, and high-density commercial Wi-Fi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-ariiti-accent hover:shadow-md transition-all duration-200 text-left">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ariiti-navy mb-1.5 text-base">
              Hardware & POS Systems
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Commercial touch POS terminals, 80mm thermal receipt printers, and 2D barcode scanners.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-ariiti-accent hover:shadow-md transition-all duration-200 text-left">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ariiti-navy mb-1.5 text-base">
              Preventive Maintenance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Proactive scheduled cleaning, verified off-site database backups, and emergency 2-hour on-site SLAs.
            </p>
          </div>
        </div>

        {/* Featured Live Service Cards */}
        {services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.slice(0, 4).map((service) => (
              <ServiceCard key={service._id.toString()} service={service} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button href="/services" variant="outline" size="md" className="font-bold">
            <span>Explore All Engineering Services</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </section>

      {/* 5. Detailed Visual Service Division Showcase (Alternating Layouts) */}
      <div className="border-t border-slate-200/80 bg-slate-50/50">
        <ServiceDivisionShowcase />
      </div>

      {/* 6. Why Choose Ariiti Tech & Company Working Process */}
      <WhyChooseUs />

      {/* 7. Featured Proprietary Software Products */}
      <section className="bg-white py-14 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <SectionHeader
              eyebrow="Proprietary Technology Ecosystem"
              title="Built for the Operational Realities of Eastern Ethiopia"
              description="Independent commercial software products engineered by Ariiti Tech with offline resilience, low-bandwidth optimization, and local peripheral support."
            />
            <Button
              href="/products"
              variant="outline"
              size="sm"
              className="shrink-0 self-start md:self-end font-bold"
            >
              <span>Product Ecosystem Directory</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Featured Case Studies & Verifiable Deployments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <SectionHeader
            eyebrow="Corporate Project Directory"
            title="Real-World Deployments. Verifiable Engineering."
            description="Explore our corporate case studies covering offline-first billing platforms, multi-floor Cat6 commercial LANs, and medical clinic infrastructures in Harar and Dire Dawa."
          />
          <Button
            href="/portfolio"
            variant="outline"
            size="sm"
            className="shrink-0 self-start md:self-end font-bold"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.slice(0, 4).map((caseStudy) => (
            <CaseStudyCard
              key={caseStudy._id.toString()}
              caseStudy={caseStudy}
            />
          ))}
        </div>
      </section>

      {/* 9. Verified Customer Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 10. Dedicated Technical Units & Service Personnel */}
      <TeamCapabilities />

      {/* 11. Regional Presence & Physical Infrastructure Hubs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionalPresence />
      </div>

      {/* 12. Final High-Contrast Call to Action for Service Inquiries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-ariiti-navy via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
              Direct Commercial Inquiries & SLA Requests
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Upgrade Your Business Technology Infrastructure?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Whether you need offline POS terminals installed, multi-floor Cat6 cabling deployed, or a guaranteed 2-hour emergency SLA agreement in Harar or Dire Dawa, our team is ready to assist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              href="/contact"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto font-bold bg-white text-ariiti-navy hover:bg-slate-100 shadow-lg justify-center"
            >
              <span>Request a Service</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-ariiti-accent" />
            </Button>
            <a
              href={`https://wa.me/${(settings.whatsappNumber || "").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
