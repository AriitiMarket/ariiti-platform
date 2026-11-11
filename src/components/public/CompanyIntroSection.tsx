import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

export const CompanyIntroSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-sm text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-ariiti-accent text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Software Solutions & Business Technology</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ariiti-navy tracking-tight leading-tight">
              Technology Solutions That Help Your Business Grow.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              Ariiti Tech provides practical software solutions, business systems,
              networking infrastructure, and technical support to help businesses operate
              more efficiently. Stationed directly in Harar and Dire Dawa, we engineer
              robust systems tailored to regional commercial demands.
            </p>

            {/* 4 Primary Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button href="/services" variant="primary" size="md" className="font-bold">
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <Button href="/portfolio" variant="outline" size="md" className="font-bold">
                <span>View Our Projects</span>
              </Button>

              <Button href="/contact" variant="primary" size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-0">
                <span>Request a Service</span>
              </Button>

              <Link
                href="/contact"
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-ariiti-navy hover:bg-slate-100 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3.5">
            <h3 className="font-bold text-sm text-ariiti-navy uppercase tracking-wider">
              Core Regional Mandate
            </h3>
            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Zero-latency offline retail billing & POS syncing</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Certified Cat6 structured cabling & server racks</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Guaranteed &lt;2-hour on-site SLA response</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Full local spare parts inventory in Eastern Ethiopia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntroSection;
