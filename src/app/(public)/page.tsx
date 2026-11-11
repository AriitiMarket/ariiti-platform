import React from "react";
import HeroSection from "@/components/public/HeroSection";
import CompanyIntroSection from "@/components/public/CompanyIntroSection";
import SectionHeader from "@/components/ui/SectionHeader";
import ServiceCard from "@/components/public/ServiceCard";
import ProductCard from "@/components/public/ProductCard";
import WhyChooseUs from "@/components/public/WhyChooseUs";
import HowWeWork from "@/components/public/HowWeWork";
import CaseStudyCard from "@/components/public/CaseStudyCard";
import BlogCard from "@/components/public/BlogCard";
import Button from "@/components/ui/Button";
import {
  getActiveServices,
  getPublishedProducts,
  getPublishedCaseStudies,
  getPublishedArticles,
  getWebsiteSettings,
} from "@/lib/queries/publicData";
import { ArrowRight, MessageCircle } from "lucide-react";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  const [services, products, caseStudies, articles, settings] =
    await Promise.all([
      getActiveServices(),
      getPublishedProducts(true),
      getPublishedCaseStudies({ featuredOnly: true }),
      getPublishedArticles(),
      getWebsiteSettings(),
    ]);

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      {/* 1. Hero banner with background image slider */}
      <HeroSection />

      {/* 2. Short Ariiti Tech company introduction */}
      <CompanyIntroSection />

      {/* 3. Featured Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <SectionHeader
            eyebrow="What We Do"
            title="Technology Solutions for Your Business"
            description="We develop practical software and digital systems that help businesses work smarter, serve customers better and grow."
          />
          <Button
            href="/services"
            variant="outline"
            size="sm"
            className="shrink-0 self-start md:self-end font-bold text-[#093053] border-slate-300 hover:bg-slate-50"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        {services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.slice(0, 4).map((service) => (
              <ServiceCard key={service._id.toString()} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Featured Products */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <SectionHeader
              eyebrow="Proprietary Technology"
              title="Products & Solutions"
              description="Explore practical technology products designed to simplify business operations."
            />
            <Button
              href="/products"
              variant="outline"
              size="sm"
              className="shrink-0 self-start md:self-end font-bold text-[#093053] border-slate-300 hover:bg-white"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Ariiti Tech */}
      <WhyChooseUs />

      {/* 6. How We Work */}
      <HowWeWork />

      {/* 7. Featured Portfolio Projects */}
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
            className="shrink-0 self-start md:self-end font-bold text-[#093053] border-slate-300 hover:bg-slate-50"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
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

      {/* 8. Latest Blog & News Articles */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <SectionHeader
              eyebrow="Engineering Insights & News"
              title="Insights, Updates & Technology"
              description="Field notes, architecture guides, and operational updates from our engineering divisions."
            />
            <Button
              href="/blog"
              variant="outline"
              size="sm"
              className="shrink-0 self-start md:self-end font-bold text-[#093053] border-slate-300 hover:bg-white"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

          {articles.length > 0 && (
            <div className="space-y-8">
              {/* Top Featured Article */}
              <BlogCard article={articles[0]} featured={true} />

              {/* Grid for Additional Articles */}
              {articles.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {articles.slice(1, 3).map((article) => (
                    <BlogCard
                      key={article._id?.toString() || article.slug}
                      article={article}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 9. Contact and Request a Service CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#093053] text-white rounded-3xl p-8 sm:p-12 border border-[#07243e] shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
              Direct Inquiries & Service Requests
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Upgrade Your Business Technology Infrastructure?
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Whether you need custom software systems, Cat6 structured cabling, POS equipment, or rapid on-site technical support in Harar or Dire Dawa, our team is ready to help.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              href="/contact"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto font-bold bg-white text-[#093053] hover:bg-slate-100 shadow-lg justify-center"
            >
              <span>Request a Service</span>
              <ArrowRight className="w-4 h-4 ml-1.5 text-[#093053]" />
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
