import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

const WORKING_STEPS = [
  {
    number: "01",
    title: "Needs Discovery & Site Audit",
    description:
      "We visit your facility in Harar or Dire Dawa to inspect physical cable paths, power stability, hardware requirements, and operational bottlenecks.",
  },
  {
    number: "02",
    title: "Architecture & Feasibility Blueprint",
    description:
      "We engineer the exact software database schemas, network topologies, and hardware specifications with transparent commercial pricing.",
  },
  {
    number: "03",
    title: "On-Premise Deployment & Testing",
    description:
      "Certified Cat6 cabling, server rack setup, POS peripheral integration, and hands-on staff operational training on live production systems.",
  },
  {
    number: "04",
    title: "Continuous SLA Care & Support",
    description:
      "Scheduled hardware cleaning, verified off-site database backups, and guaranteed contractual 2-hour priority emergency on-site dispatch.",
  },
];

export const HowWeWork: React.FC = () => {
  return (
    <section className="bg-[#093053] text-white py-16 sm:py-20 border-y border-[#07243e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Working Process"
          title="How We Deliver Reliable Technology"
          description="A disciplined, step-by-step engineering approach from initial physical site audit to continuous operational SLA care."
          align="center"
          className="mb-12 text-white [&>h2]:text-white [&>p]:text-white/80 [&>span]:text-emerald-300"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {WORKING_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#0d3f6d] border border-white/15 rounded-2xl p-6 relative flex flex-col justify-between shadow-md"
            >
              <div>
                <span className="text-3xl font-black font-mono text-emerald-300 block mb-3">
                  {step.number}
                </span>
                <h3 className="font-bold text-base text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {idx < 3 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-white/40">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            href="/contact"
            variant="secondary"
            size="md"
            className="font-bold bg-white text-[#093053] hover:bg-slate-100 shadow-lg"
          >
            <span>Schedule a Free Site Discovery Audit</span>
            <ArrowRight className="w-4 h-4 ml-1.5 text-[#093053]" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
