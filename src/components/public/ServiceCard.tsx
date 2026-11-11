"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IService } from "@/models/Service";
import {
  Code2,
  Network,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Users,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface ServiceCardProps {
  service: IService;
}

const CATEGORY_FORMATTERS: Record<
  string,
  { label: string; variant: "development" | "info" | "available" | "neutral" }
> = {
  SOFTWARE_DEVELOPMENT: { label: "Software Systems", variant: "development" },
  NETWORKING_INFRASTRUCTURE: { label: "Networking & LAN", variant: "info" },
  HARDWARE_EQUIPMENT: { label: "Hardware & POS", variant: "available" },
  IT_MAINTENANCE_SUPPORT: { label: "Maintenance SLA", variant: "neutral" },
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [activeTab, setActiveTab] = useState<"deliverables" | "problems">("deliverables");

  const categoryMeta = CATEGORY_FORMATTERS[service.category] || {
    label: service.category.replace(/_/g, " "),
    variant: "neutral",
  };

  const renderIcon = () => {
    switch (service.category) {
      case "SOFTWARE_DEVELOPMENT":
        return <Code2 className="w-6 h-6 text-ariiti-accent" />;
      case "NETWORKING_INFRASTRUCTURE":
        return <Network className="w-6 h-6 text-ariiti-accent" />;
      case "HARDWARE_EQUIPMENT":
        return <Cpu className="w-6 h-6 text-ariiti-accent" />;
      case "IT_MAINTENANCE_SUPPORT":
      default:
        return <ShieldCheck className="w-6 h-6 text-ariiti-accent" />;
    }
  };

  const deliverables = (service.whatsIncluded || []).slice(0, 3);
  const problems = (service.problemsSolved || []).slice(0, 3);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 p-6 sm:p-7 text-left group">
      {/* Top Metadata */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-ariiti-navy/5 flex items-center justify-center shrink-0 group-hover:bg-ariiti-accent/10 transition-colors">
          {renderIcon()}
        </div>
        <Badge variant={categoryMeta.variant} withDot={false}>
          {categoryMeta.label}
        </Badge>
      </div>

      {/* Title & Summary */}
      <h3 className="text-xl font-bold text-ariiti-navy mb-2 tracking-tight group-hover:text-ariiti-accent transition-colors leading-snug">
        <Link href={`/services/${service.slug}`}>{service.title}</Link>
      </h3>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
        {service.summary}
      </p>

      {/* Target Audience Pill */}
      {service.targetCustomers && (
        <div className="mb-4 flex items-start gap-2 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70">
          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            <strong>Target:</strong> {service.targetCustomers}
          </span>
        </div>
      )}

      {/* Scope Preview Tab Switcher */}
      <div className="border-t border-slate-100 pt-3 mb-2.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("deliverables")}
          className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
            activeTab === "deliverables"
              ? "bg-ariiti-navy text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 bg-slate-100"
          }`}
        >
          Deliverables ({deliverables.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("problems")}
          className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
            activeTab === "problems"
              ? "bg-ariiti-navy text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 bg-slate-100"
          }`}
        >
          Problems Solved ({problems.length})
        </button>
      </div>

      {/* Tabbed Scope Details */}
      <div className="flex-1 min-h-[90px] mb-4">
        {activeTab === "deliverables" ? (
          <ul className="space-y-2 text-xs text-slate-700">
            {deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2 text-xs text-slate-700">
            {problems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Action Links */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
        <Link
          href={`/services/${service.slug}`}
          className="text-xs font-bold text-ariiti-navy hover:text-ariiti-accent flex items-center gap-1 transition-colors"
        >
          <span>Full Scope</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Button
          href={`/contact?category=${service.category}&service=${service.slug}`}
          variant="primary"
          size="sm"
          className="font-bold shadow-sm"
        >
          Request Service
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
