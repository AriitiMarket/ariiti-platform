import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import AddNoteModal from "@/components/admin/AddNoteModal";
import { buildWhatsAppUrl } from "@/lib/utils";
import {
  ChevronLeft,
  Phone,
  Building,
  MessageSquare,
  MapPin,
  User,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface SingleInquiryPageProps {
  params: {
    id: string;
  };
}

export default async function SingleInquiryPage({
  params,
}: SingleInquiryPageProps) {
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    notFound();
  }

  await connectDB();

  const inquiry = await Inquiry.findById(params.id).lean();
  if (!inquiry) {
    notFound();
  }

  const waUrl = buildWhatsAppUrl(inquiry.phone, {
    service: inquiry.requestedServiceTitle,
    details: `Hello ${inquiry.customerName}, this is Ariiti Tech following up on your inquiry for ${inquiry.requestedServiceTitle}.`,
  });

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Back Link */}
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Inquiries Workspace</span>
      </Link>

      {/* Top Banner Header: White background with subtle borders and shadows */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm text-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded border uppercase ${
                inquiry.status === "NEW"
                  ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
                  : inquiry.status === "CONTACTED"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              Status: {inquiry.status}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Ref #{inquiry._id.toString().slice(-6).toUpperCase()}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-brand-primary tracking-tight">
            {inquiry.customerName}
          </h1>

          {inquiry.businessName && (
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{inquiry.businessName}</span>
            </p>
          )}
        </div>

        {/* Quick Contact Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={`tel:${inquiry.phone}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-brand-primary text-xs font-bold transition-all border border-brand-primary shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-brand-primary" />
            <span>Call {inquiry.phone}</span>
          </a>

          <AddNoteModal inquiryId={inquiry._id.toString()} />
        </div>
      </div>

      {/* Two Column Layout: Inbound Metadata + Project Description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Client Attributes (1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm text-slate-900">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pb-2 border-b border-slate-100">
            Client Details
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Phone Number
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {inquiry.phone}
              </span>
            </div>

            {inquiry.email && (
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  Email Address
                </span>
                <span className="font-medium text-slate-700 font-mono">
                  {inquiry.email}
                </span>
              </div>
            )}

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Location
              </span>
              <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                <span>{inquiry.location}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Service Category
              </span>
              <span className="font-medium text-slate-700 font-mono">
                {inquiry.serviceCategory}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Submitted At
              </span>
              <span className="font-medium text-slate-500 font-mono">
                {inquiry.createdAt
                  ? new Date(inquiry.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>

            {inquiry.referralContext && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  Referral Origin
                </span>
                <div className="text-[11px] text-slate-500 space-y-0.5 mt-1 font-mono">
                  {inquiry.referralContext.sourcePage && (
                    <p>Page: {inquiry.referralContext.sourcePage}</p>
                  )}
                  {inquiry.referralContext.caseStudySlug && (
                    <p>Case: {inquiry.referralContext.caseStudySlug}</p>
                  )}
                  {inquiry.referralContext.productSlug && (
                    <p>Product: {inquiry.referralContext.productSlug}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Project Requirements + Internal Notes Timeline (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Project Requirements */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-2">
              Customer Requirements &amp; Scope Description
            </h3>
            <h4 className="text-sm font-bold text-brand-primary mb-3">
              Requested: {inquiry.requestedServiceTitle}
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {inquiry.projectDescription}
            </div>
          </div>

          {/* Internal Operations Notes Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary font-mono">
                  Internal Operations Notes ({inquiry.internalNotes?.length || 0})
                </h3>
              </div>
              <AddNoteModal inquiryId={inquiry._id.toString()} />
            </div>

            {inquiry.internalNotes && inquiry.internalNotes.length > 0 ? (
              <div className="space-y-3">
                {inquiry.internalNotes.map((note: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 text-slate-500">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-brand-primary" />
                        <span>{note.authorName}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {note.note}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No internal notes recorded for this inquiry yet. Click &quot;Add Internal Note&quot; to log follow-up milestones.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
