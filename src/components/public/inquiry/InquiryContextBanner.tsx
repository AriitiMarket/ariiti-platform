"use client";

import React from "react";
import { Info, RotateCcw } from "lucide-react";

interface InquiryContextBannerProps {
  caseStudySlug?: string;
  hasRestoredDraft: boolean;
  onClearDraft: () => void;
}

export const InquiryContextBanner: React.FC<InquiryContextBannerProps> = ({
  caseStudySlug,
  hasRestoredDraft,
  onClearDraft,
}) => {
  return (
    <>
      {/* Case Study Context Banner */}
      {caseStudySlug && (
        <div className="mb-6 p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
          <Info className="w-4 h-4 text-ariiti-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Contextual Inquiry:</span> You are inquiring about a technical solution similar to our published deployment:{" "}
            <span className="font-mono font-semibold underline">
              {caseStudySlug}
            </span>.
          </div>
        </div>
      )}

      {/* Restored Draft Notice */}
      {hasRestoredDraft && (
        <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 text-ariiti-accent" />
            <span>Restored your unfinished draft from browser storage.</span>
          </div>
          <button
            type="button"
            onClick={onClearDraft}
            className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
          >
            Clear draft
          </button>
        </div>
      )}
    </>
  );
};
