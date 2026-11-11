import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ICaseStudy } from "@/models/CaseStudy";
import Badge from "@/components/ui/Badge";
import CaseStudyPreviewModal from "./CaseStudyPreviewModal";
import {
  MapPin,
  ArrowRight,
  Building,
  CheckCircle,
  Shield,
  Activity,
} from "lucide-react";

interface CaseStudyCardProps {
  caseStudy: ICaseStudy;
}

const CATEGORY_NAMES: Record<string, string> = {
  SOFTWARE_DEVELOPMENT: "Software System",
  NETWORKING_INFRASTRUCTURE: "Commercial LAN",
  HARDWARE_EQUIPMENT: "POS Hardware",
  IT_MAINTENANCE_SUPPORT: "IT SLA Support",
};

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy }) => {
  const clientDisplayName = caseStudy.isClientConfidential
    ? `Confidential ${caseStudy.clientSector} Client`
    : caseStudy.clientName || `${caseStudy.clientSector} Client`;

  const categoryLabel =
    CATEGORY_NAMES[caseStudy.category] || caseStudy.category.replace(/_/g, " ");

  const topTech = (caseStudy.technologiesAndEquipment || []).slice(0, 4);
  const primaryOutcome = (caseStudy.measurableOutcomes || [])[0];

  return (
    <article className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden group">
      {/* Cover Image & Metadata Overlay */}
      <div className="relative h-52 sm:h-56 w-full bg-slate-900 overflow-hidden">
        {caseStudy.coverImageUrl ? (
          <Image
            src={caseStudy.coverImageUrl}
            alt={caseStudy.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ariiti-navy/10 text-ariiti-navy">
            <Building className="w-12 h-12 text-slate-400" />
          </div>
        )}

        {/* Gradient dark scrim for readable badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Floating Category Pill */}
        <div className="absolute top-3.5 left-3.5">
          <Badge variant="development" withDot={false}>
            {categoryLabel}
          </Badge>
        </div>

        {/* Location Tag */}
        <div className="absolute bottom-3.5 right-3.5 bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm border border-white/10">
          <MapPin className="w-3 h-3 text-ariiti-accent" />
          <span>{caseStudy.location}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Client Attribution with NDA Confidentiality Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2.5">
            {caseStudy.isClientConfidential ? (
              <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{clientDisplayName}</span>
                <span className="text-[10px] text-amber-700 font-mono font-bold">(NDA)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-600">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{clientDisplayName}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-ariiti-navy tracking-tight mb-2.5 group-hover:text-ariiti-accent transition-colors leading-snug">
            <Link href={`/portfolio/${caseStudy.slug}`}>
              {caseStudy.title}
            </Link>
          </h3>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
            {caseStudy.summary}
          </p>

          {/* Highlighted Outcome Preview */}
          {primaryOutcome && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 flex items-start gap-2.5 text-xs text-emerald-900">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="line-clamp-2 font-medium leading-relaxed">{primaryOutcome}</span>
            </div>
          )}

          {/* Technologies Snapshot */}
          {topTech.length > 0 && (
            <div className="pt-2 mb-4">
              <div className="flex flex-wrap gap-1.5">
                {topTech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions: Quick Preview Modal & Full Case Study Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <CaseStudyPreviewModal caseStudy={caseStudy} />

          <Link
            href={`/portfolio/${caseStudy.slug}`}
            className="text-xs font-bold text-ariiti-navy hover:text-ariiti-accent flex items-center gap-1 transition-colors"
          >
            <span>Full Case Study</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CaseStudyCard;
