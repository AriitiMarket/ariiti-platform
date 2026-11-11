import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Clock,
  Server,
  Layers,
  MapPin,
  Cpu,
} from "lucide-react";

interface MetricItem {
  value: string;
  unit?: string;
  label: string;
  description: string;
  icon: React.ElementType;
  badge: string;
}

const METRICS: MetricItem[] = [
  {
    value: "99.9",
    unit: "%",
    label: "Checkout Availability",
    description:
      "Offline-first sync guarantees commercial billing continues uninterrupted during telecom fiber drops.",
    icon: Zap,
    badge: "Offline POS Architecture",
  },
  {
    value: "<2",
    unit: "hrs",
    label: "Emergency SLA Dispatch",
    description:
      "Contractually backed on-premise emergency dispatch throughout Harar and Dire Dawa commercial districts.",
    icon: Clock,
    badge: "Rapid Regional Response",
  },
  {
    value: "500",
    unit: "+",
    label: "Certified LAN Drops",
    description:
      "Fluke-certified Cat6/Cat6A structured cabling, MikroTik CCR core routing, and rack installations.",
    icon: Server,
    badge: "Carrier-Grade Networking",
  },
  {
    value: "100",
    unit: "%",
    label: "Resident Engineering Team",
    description:
      "Full-time hardware technicians, network engineers, and software architects stationed on the ground.",
    icon: ShieldCheck,
    badge: "Harar & Dire Dawa Hubs",
  },
];

export const TrustMetricsBanner: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <section
      className={`bg-white border-y border-slate-200/90 py-6 sm:py-8 shadow-sm ${className}`}
      aria-label="Verified Technical Performance Metrics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle Top Eyebrow */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
              Verified Operational Capabilities & SLA Standards
            </h3>
          </div>
          <span className="hidden sm:inline text-xs font-mono text-slate-400">
            EASTERN ETHIOPIA FIELD REPORT
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-ariiti-accent hover:shadow-md hover:bg-white transition-all duration-200 text-left group"
              >
                {/* Metric Top Bar with Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-ariiti-navy/5 text-ariiti-navy flex items-center justify-center group-hover:bg-ariiti-accent group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200/80">
                    {item.badge}
                  </span>
                </div>

                {/* Big Number */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl sm:text-4xl font-black text-ariiti-navy tracking-tight font-mono">
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-lg sm:text-xl font-bold text-ariiti-accent font-mono">
                      {item.unit}
                    </span>
                  )}
                </div>

                {/* Metric Title & Description */}
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                  {item.label}
                </h4>
                <p className="text-xs text-ariiti-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustMetricsBanner;
