import React from "react";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import CaseStudy from "@/models/CaseStudy";
import {
  FileCode,
  Plus,
  ExternalLink,
  Edit3,
  Trash2,
  MapPin,
  CheckCircle,
  Eye,
  AlertCircle,
} from "lucide-react";
import DeleteCaseStudyButton from "@/components/admin/DeleteCaseStudyButton";

export const dynamic = "force-dynamic";

export default async function AdminCaseStudiesPage() {
  await connectDB();

  const caseStudies = await CaseStudy.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCode className="w-4 h-4 text-ariiti-accent" />
            <span className="text-xs font-mono uppercase tracking-wider text-ariiti-accent font-bold">
              Content Management System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Case Studies & Project Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage corporate technical case studies, update equipment specs, and publish customer deployments.
          </p>
        </div>

        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-ariiti-accent hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Case Study</span>
        </Link>
      </div>

      {/* Case Studies Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Case Study</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Publication</th>
                <th className="py-3.5 px-4">Execution</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {caseStudies.length > 0 ? (
                caseStudies.map((cs) => (
                  <tr
                    key={cs._id.toString()}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-100 text-sm">
                        {cs.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        /{cs.slug}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium text-slate-300">
                        {cs.category.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-ariiti-accent shrink-0" />
                        <span>{cs.location}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          cs.publicationStatus === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : cs.publicationStatus === "DRAFT"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                        }`}
                      >
                        {cs.publicationStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-slate-300 font-medium">
                        {cs.projectStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/portfolio/${cs.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View on public platform"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/case-studies/${cs._id.toString()}/edit`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-bold transition-colors border border-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>

                        <DeleteCaseStudyButton
                          id={cs._id.toString()}
                          title={cs.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold">No case studies cataloged yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
