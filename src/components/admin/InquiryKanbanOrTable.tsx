"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { updateInquiryStatus } from "@/actions/adminInquiryActions";

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
    className: "bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse",
  },
  CONTACTED: {
    label: "CONTACTED",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  QUALIFIED: {
    label: "QUALIFIED",
    className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  IN_PROGRESS: {
    label: "IN PROGRESS",
    className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  },
  RESOLVED: {
    label: "RESOLVED",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  CLOSED: {
    label: "CLOSED",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  },
  SPAM: {
    label: "SPAM",
    className: "bg-red-500/10 text-red-400 border-red-500/30",
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
      inquiry.location.toLowerCase().includes(query) ||
      inquiry.requestedServiceTitle.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, business, phone, or location..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ariiti-accent"
          />
        </div>

        {/* Status Tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilterStatus(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === opt.value
                  ? "bg-ariiti-accent text-white font-bold"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Client / Business</th>
                <th className="py-3 px-4">Service Requested</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Status Workflow</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => {
                  const badge = STATUS_BADGES[inquiry.status] || STATUS_BADGES.NEW;
                  return (
                    <tr
                      key={inquiry._id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Client Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100 text-sm">
                          {inquiry.customerName}
                        </div>
                        {inquiry.businessName && (
                          <div className="text-[11px] text-slate-400 font-medium">
                            {inquiry.businessName}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{inquiry.phone}</span>
                          </span>
                        </div>
                      </td>

                      {/* Requested Service */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-200 truncate">
                          {inquiry.requestedServiceTitle}
                        </div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                          {inquiry.serviceCategory.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-ariiti-accent shrink-0" />
                          <span>{inquiry.location}</span>
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
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
                          className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border bg-slate-950 focus:outline-none focus:ring-1 focus:ring-ariiti-accent transition-colors ${badge.className}`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="SPAM">SPAM</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/inquiries/${inquiry._id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-ariiti-accent hover:text-white text-slate-200 text-xs font-bold transition-colors border border-slate-700"
                          >
                            <span>Inspect</span>
                            {inquiry.internalNotesCount > 0 && (
                              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[10px]">
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
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
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
