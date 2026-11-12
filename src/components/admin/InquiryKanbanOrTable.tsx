"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { updateInquiryStatus } from "@/actions/admin/inquiries";

export interface SerializedInquiry {
  _id: string;
  customerName: string;
  businessName?: string;
  phone: string;
  email?: string;
  serviceCategory: string;
  requestedServiceTitle: string;
  location: string;
  projectDescription: string;
  status: string;
  internalNotesCount: number;
  createdAt: string;
}

interface InquiryKanbanOrTableProps {
  initialInquiries: SerializedInquiry[];
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Inquiries" },
  { value: "NEW", label: "New (Unprocessed)" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved / Closed" },
  { value: "SPAM", label: "Spam / Rejected" },
];

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  NEW: {
    label: "NEW",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  CONTACTED: {
    label: "CONTACTED",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  QUALIFIED: {
    label: "QUALIFIED",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  IN_PROGRESS: {
    label: "IN PROGRESS",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  RESOLVED: {
    label: "RESOLVED",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CLOSED: {
    label: "CLOSED",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  SPAM: {
    label: "SPAM",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export const InquiryKanbanOrTable: React.FC<InquiryKanbanOrTableProps> = ({
  initialInquiries,
}) => {
  const [inquiries, setInquiries] = useState<SerializedInquiry[]>(initialInquiries);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleStatusChange = (inquiryId: string, newStatus: string) => {
    // Optimistic UI update
    setInquiries((prev) =>
      prev.map((item) =>
        item._id === inquiryId ? { ...item, status: newStatus } : item
      )
    );

    startTransition(async () => {
      const res = await updateInquiryStatus(inquiryId, newStatus);
      if (!res.success) {
        setFeedback(res.error || "Failed to update status");
        // Revert on error
        setInquiries(initialInquiries);
      } else {
        setFeedback("Status updated successfully.");
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus =
      filterStatus === "ALL" ||
      inquiry.status === filterStatus ||
      (filterStatus === "RESOLVED" && inquiry.status === "CLOSED");

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      inquiry.customerName.toLowerCase().includes(query) ||
      (inquiry.businessName && inquiry.businessName.toLowerCase().includes(query)) ||
      inquiry.phone.includes(query) ||
      inquiry.location.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Search Input: White background with clear neutral border */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-primary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, business, phone, or location..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
          />
        </div>

        {/* Status Tab Pills: Selected tab = Deep Navy Blue */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilterStatus(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === opt.value
                  ? "bg-brand-primary text-white font-bold shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Table Container: White background, readable text, subtle separators */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-bold">Client / Business</th>
                <th className="py-3.5 px-4 font-bold">Service Requested</th>
                <th className="py-3.5 px-4 font-bold">Location</th>
                <th className="py-3.5 px-4 font-bold">Submitted</th>
                <th className="py-3.5 px-4 font-bold">Status Workflow</th>
                <th className="py-3.5 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => {
                  const badge = STATUS_BADGES[inquiry.status] || STATUS_BADGES.NEW;
                  return (
                    <tr
                      key={inquiry._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Client Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {inquiry.customerName}
                        </div>
                        {inquiry.businessName && (
                          <div className="text-[11px] text-slate-500 font-medium">
                            {inquiry.businessName}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{inquiry.phone}</span>
                          </span>
                        </div>
                      </td>

                      {/* Requested Service */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-brand-primary truncate">
                          {inquiry.requestedServiceTitle}
                        </div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                          {inquiry.serviceCategory.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3 text-brand-primary shrink-0" />
                          <span>{inquiry.location}</span>
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={inquiry.status}
                          disabled={isPending}
                          onChange={(e) =>
                            handleStatusChange(inquiry._id, e.target.value)
                          }
                          className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors cursor-pointer shadow-xs ${badge.className}`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="SPAM">SPAM</option>
                        </select>
                      </td>

                      {/* Actions: Secondary Button (White with deep navy border and text) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/inquiries/${inquiry._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-brand-primary text-xs font-bold transition-colors border border-brand-primary shadow-xs"
                          >
                            <span>Inspect</span>
                            {inquiry.internalNotesCount > 0 && (
                              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-100 text-brand-primary text-[10px]">
                                {inquiry.internalNotesCount}
                              </span>
                            )}
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold">No inquiries found matching criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InquiryKanbanOrTable;
