import React from "react";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import InquiryKanbanOrTable, {
  SerializedInquiry,
} from "@/components/admin/InquiryKanbanOrTable";
import { Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  await connectDB();

  const rawInquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();

  const inquiries: SerializedInquiry[] = rawInquiries.map((inq) => ({
    _id: inq._id.toString(),
    customerName: inq.customerName,
    businessName: inq.businessName,
    phone: inq.phone,
    email: inq.email,
    serviceCategory: inq.serviceCategory,
    requestedServiceTitle: inq.requestedServiceTitle,
    location: inq.location,
    projectDescription: inq.projectDescription,
    status: inq.status,
    internalNotesCount: inq.internalNotes?.length || 0,
    createdAt: inq.createdAt ? inq.createdAt.toISOString() : new Date().toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Inbox className="w-4 h-4 text-ariiti-accent" />
          <span className="text-xs font-mono uppercase tracking-wider text-ariiti-accent font-bold">
            Customer Ingestion Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Inquiries & Leads Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review, filter, track status transitions, and append internal engineering notes to inbound commercial inquiries.
        </p>
      </div>

      {/* Interactive Table with Filters and Live Updates */}
      <InquiryKanbanOrTable initialInquiries={inquiries} />
    </div>
  );
}
