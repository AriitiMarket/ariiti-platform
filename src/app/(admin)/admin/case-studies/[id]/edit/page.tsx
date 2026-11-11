import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import CaseStudy from "@/models/CaseStudy";
import CaseStudyForm from "@/components/admin/CaseStudyForm";
import { ChevronLeft, Edit3 } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditCaseStudyPageProps {
  params: {
    id: string;
  };
}

export default async function EditCaseStudyPage({
  params,
}: EditCaseStudyPageProps) {
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    notFound();
  }

  await connectDB();

  const caseStudy = await CaseStudy.findById(params.id).lean();
  if (!caseStudy) {
    notFound();
  }

  const initialData = {
    _id: caseStudy._id.toString(),
    title: caseStudy.title,
    slug: caseStudy.slug,
    category: caseStudy.category,
    projectType: caseStudy.projectType,
    clientSector: caseStudy.clientSector,
    clientName: caseStudy.clientName,
    isClientConfidential: caseStudy.isClientConfidential,
    location: caseStudy.location,
    summary: caseStudy.summary,
    problemAddressed: caseStudy.problemAddressed,
    solutionImplemented: caseStudy.solutionImplemented,
    technologiesAndEquipment: caseStudy.technologiesAndEquipment,
    measurableOutcomes: caseStudy.measurableOutcomes,
    coverImageUrl: caseStudy.coverImageUrl,
    galleryImageUrls: caseStudy.galleryImageUrls,
    liveOrDemoUrl: caseStudy.liveOrDemoUrl,
    projectStatus: caseStudy.projectStatus,
    publicationStatus: caseStudy.publicationStatus,
    isFeatured: caseStudy.isFeatured,
    displayOrder: caseStudy.displayOrder,
  };

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
          <Edit3 className="w-4 h-4 text-ariiti-accent" />
          <span className="text-xs font-mono uppercase tracking-wider text-ariiti-accent font-bold">
            CMS Editor
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Edit Case Study: {caseStudy.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Update architectural specifications, equipment lists, outcome metrics, and publication visibility.
        </p>
      </div>

      <CaseStudyForm initialData={initialData} isEditing={true} />
    </div>
  );
}
