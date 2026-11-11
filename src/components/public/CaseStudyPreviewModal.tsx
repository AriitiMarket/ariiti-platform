"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  ExternalLink,
  Shield,
  Building,
  MapPin,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Eye,
} from "lucide-react";
import { ICaseStudy } from "@/models/CaseStudy";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface CaseStudyPreviewModalProps {
  caseStudy: ICaseStudy;
}

export const CaseStudyPreviewModal: React.FC<CaseStudyPreviewModalProps> = ({
  caseStudy,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const clientDisplayName = caseStudy.isClientConfidential
    ? `Confidential ${caseStudy.clientSector} Client`
    : caseStudy.clientName || `${caseStudy.clientSector} Client`;

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-ariiti-navy hover:text-white text-slate-700 text-xs font-bold transition-all duration-150"
        aria-label={`Preview case study architecture for ${caseStudy.title}`}
      >
        <Eye className="w-3.5 h-3.5 text-ariiti-accent" />
        <span>Quick Preview</span>
      </button>

      {/* Modal Overlay & Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 text-left"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-modal-title"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="development" withDot={false}>
                    {caseStudy.category.replace(/_/g, " ")}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-ariiti-accent" />
                    <span>{caseStudy.location}</span>
                  </span>
                </div>
                <h3
                  id="case-study-modal-title"
                  className="text-lg sm:text-xl font-bold text-ariiti-navy tracking-tight leading-snug"
                >
                  {caseStudy.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  {caseStudy.isClientConfidential ? (
                    <div className="flex items-center gap-1 text-amber-700 font-medium">
                      <Shield className="w-3 h-3 text-amber-600" />
                      <span>{clientDisplayName}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{clientDisplayName}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close case study preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Problem Addressed */}
              <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                  Operational Challenge & Context:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {caseStudy.problemAddressed}
                </p>
              </div>

              {/* Solution Implemented */}
              <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                  Engineered Architectural Solution:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {caseStudy.solutionImplemented}
                </p>
              </div>

              {/* Technologies & Equipment */}
              {caseStudy.technologiesAndEquipment?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-ariiti-accent" />
                    <span>Technologies & Hardware Deployed:</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {caseStudy.technologiesAndEquipment.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Measurable Outcomes */}
              {caseStudy.measurableOutcomes?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verifiable Project Outcomes:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {caseStudy.measurableOutcomes.map((outcome, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href={`/portfolio/${caseStudy.slug}`}
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-ariiti-navy hover:text-ariiti-accent flex items-center gap-1"
              >
                <span>Read Full Architectural Writeup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  href={`/contact?caseStudy=${caseStudy.slug}&category=${caseStudy.category}`}
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto font-bold"
                >
                  Request Similar Solution
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseStudyPreviewModal;
