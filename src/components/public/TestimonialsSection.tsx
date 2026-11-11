import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Quote, Star, Building2, MapPin, CheckCircle2 } from "lucide-react";

interface Testimonial {
  quote: string;
  clientType: string;
  location: string;
  deploymentSummary: string;
  verifiedTag: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "When Ethio Telecom's fiber cut happened during peak evening checkout hours, our old system froze completely. Ariiti's offline POS never missed a single receipt. All 3 cashier terminals kept billing without a glitch, and everything synchronized automatically when the connection was restored.",
    clientType: "Commercial Supermarket & Retailer",
    location: "Harar Commercial Corridor",
    deploymentSummary: "Offline-First Ariiti POS + 3 Cashier Touch Terminals",
    verifiedTag: "Verified Commercial Deployment",
  },
  {
    quote:
      "We had persistent Wi-Fi dead spots across 3 floors and guest complaints every weekend. Ariiti Tech replaced the tangled wiring with certified Cat6 copper drops, a clean 12U server rack, and MikroTik VLAN routing. Our guest Wi-Fi and front-desk billing are now completely isolated and rock-solid.",
    clientType: "Hospitality & Commercial Complex",
    location: "Dire Dawa Commercial District",
    deploymentSummary: "Turnkey Cat6 Structured LAN & Dual-WAN Failover",
    verifiedTag: "Verified Infrastructure Deployment",
  },
  {
    quote:
      "Having full-time technical engineers stationed locally in Harar makes all the difference. When our main reception printer failed on a Saturday morning, their field technician was on-premise within 45 minutes with a spare replacement unit. The 2-hour SLA is real.",
    clientType: "Private Medical Diagnostic Clinic",
    location: "Harar, Eastern Ethiopia",
    deploymentSummary: "Preventive IT Maintenance Agreement & Emergency SLA",
    verifiedTag: "Verified SLA Maintenance Contract",
  },
];

interface Testimonial {
  quote: string;
  clientType: string;
  clientName?: string;
  location: string;
  deploymentSummary: string;
  verifiedTag: string;
  rating?: number;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const displayList = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SectionHeader
        eyebrow="Verified Deployment Outcomes"
        title="Trusted by Regional Businesses in Harar & Dire Dawa"
        description="Authentic operational feedback from commercial retail, hospitality, and healthcare operators running on Ariiti Tech software and infrastructure."
        align="center"
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {displayList.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {item.verifiedTag}
                </span>
              </div>

              <Quote className="w-8 h-8 text-slate-200 mb-2 -ml-1" />

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1">
              <h3 className="font-bold text-sm text-ariiti-navy">
                {item.clientType}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-ariiti-accent shrink-0" />
                <span>{item.location}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium pt-1">
                Scope: {item.deploymentSummary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
