import React from "react";
import Link from "next/link";
import CaseStudyForm from "@/components/admin/CaseStudyForm";
import { ChevronLeft, Plus } from "lucide-react";

export default function NewCaseStudyPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/case-studies"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Case Studies Directory</span>
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <Plus className="w-4 h-4 text-ariiti-accent" />
          <span className="text-xs font-mono uppercase tracking-wider text-ariiti-accent font-bold">
            CMS Authoring Studio
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Publish New Case Study
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Document an authentic B2B client deployment, infrastructure installation, or proprietary system deployment.
        </p>
      </div>

      <CaseStudyForm isEditing={false} />
    </div>
  );
}
