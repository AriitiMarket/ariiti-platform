"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Star,
  ShieldCheck,
  Building2,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { upsertTestimonial, deleteTestimonial } from "@/actions/admin/cms";

interface TestimonialItem {
  _id: string;
  quote: string;
  clientType: string;
  clientName?: string;
  location: string;
  deploymentSummary: string;
  verifiedTag: string;
  rating: number;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
}

interface TestimonialsManagerProps {
  initialTestimonials: TestimonialItem[];
}

export const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({
  initialTestimonials,
}) => {
  const [testimonials, setTestimonials] =
    useState<TestimonialItem[]>(initialTestimonials);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">(
    "ALL"
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [formData, setFormData] = useState({
    quote: "",
    clientType: "",
    clientName: "",
    location: "Harar Commercial Corridor",
    deploymentSummary: "",
    verifiedTag: "Verified Commercial Deployment",
    rating: 5,
    isPublished: true,
    displayOrder: 0,
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      quote: "",
      clientType: "",
      clientName: "",
      location: "Harar & Dire Dawa",
      deploymentSummary: "",
      verifiedTag: "Verified Commercial Deployment",
      rating: 5,
      isPublished: true,
      displayOrder: testimonials.length + 1,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem(item);
    setFormData({
      quote: item.quote,
      clientType: item.clientType,
      clientName: item.clientName || "",
      location: item.location,
      deploymentSummary: item.deploymentSummary,
      verifiedTag: item.verifiedTag || "Verified Commercial Deployment",
      rating: item.rating || 5,
      isPublished: item.isPublished,
      displayOrder: item.displayOrder || 0,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const payload = {
        quote: formData.quote.trim(),
        clientType: formData.clientType.trim(),
        clientName: formData.clientName.trim() || undefined,
        location: formData.location.trim(),
        deploymentSummary: formData.deploymentSummary.trim(),
        verifiedTag: formData.verifiedTag.trim(),
        rating: Number(formData.rating),
        isPublished: formData.isPublished,
        displayOrder: Number(formData.displayOrder) || 0,
      };

      const res = await upsertTestimonial(payload, editingItem?._id);
      if (res.success && res.id) {
        const savedItem: TestimonialItem = {
          _id: res.id,
          ...payload,
          clientName: payload.clientName || "",
          createdAt: editingItem?.createdAt || new Date().toISOString(),
        };

        if (editingItem) {
          setTestimonials((prev) =>
            prev.map((t) => (t._id === editingItem._id ? savedItem : t))
          );
        } else {
          setTestimonials((prev) => [savedItem, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        setFormError(res.error || "Failed to save testimonial.");
      }
    } catch {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (item: TestimonialItem) => {
    const updated = !item.isPublished;
    const res = await upsertTestimonial(
      {
        quote: item.quote,
        clientType: item.clientType,
        clientName: item.clientName,
        location: item.location,
        deploymentSummary: item.deploymentSummary,
        verifiedTag: item.verifiedTag,
        rating: item.rating,
        isPublished: updated,
        displayOrder: item.displayOrder,
      },
      item._id
    );

    if (res.success) {
      setTestimonials((prev) =>
        prev.map((t) => (t._id === item._id ? { ...t, isPublished: updated } : t))
      );
    }
  };

  const handleDelete = async (itemId: string, clientType: string) => {
    if (!confirm(`Are you sure you want to delete testimonial for "${clientType}"?`)) {
      return;
    }
    const res = await deleteTestimonial(itemId);
    if (res.success) {
      setTestimonials((prev) => prev.filter((t) => t._id !== itemId));
    } else {
      alert(res.error || "Failed to delete testimonial.");
    }
  };

  const filtered = testimonials.filter((item) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && item.isPublished) ||
      (statusFilter === "DRAFT" && !item.isPublished);

    const matchesSearch =
      item.clientType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deploymentSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quote.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-brand-primary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search testimonials by client, quote, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(["ALL", "PUBLISHED", "DRAFT"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  statusFilter === status
                    ? "bg-brand-primary text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Button: Deep navy blue with white text */}
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials List: White backgrounds with subtle borders and shadows */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs shadow-xs">
            No testimonials found matching your criteria.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs relative text-slate-900"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-brand-primary flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-brand-primary" />
                    {item.clientType}
                  </span>
                  {item.clientName && (
                    <span className="text-xs text-slate-500">
                      ({item.clientName})
                    </span>
                  )}
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-primary" />
                    {item.location}
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {item.verifiedTag}
                  </span>

                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${
                      item.isPublished
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {item.isPublished ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>LIVE</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-slate-400" />
                        <span>DRAFT</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Star Rating & Deployment Summary */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-mono font-bold text-slate-600 ml-1">
                    {item.rating}.0 / 5.0
                  </span>
                </div>

                <span className="text-xs font-semibold text-brand-primary bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {item.deploymentSummary}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  Order Index: {item.displayOrder}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-brand-primary text-xs font-bold transition-colors shadow-xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item._id, item.clientType)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 hover:border-red-300 transition-colors shadow-xs"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Testimonial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative my-8 text-slate-900">
            <h3 className="text-lg font-bold text-brand-primary tracking-tight mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-primary" />
              <span>{editingItem ? "Edit Client Testimonial" : "Add Verified Testimonial"}</span>
            </h3>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    Client / Organization Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientType}
                    onChange={(e) => setFormData((p) => ({ ...p, clientType: e.target.value }))}
                    placeholder="e.g. Commercial Supermarket & Retailer"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    Client Name / Representative (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData((p) => ({ ...p, clientName: e.target.value }))}
                    placeholder="e.g. Operations General Manager"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    Commercial Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Harar Commercial Corridor"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    Star Rating (1 - 5) *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData((p) => ({ ...p, rating: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Strong)</option>
                    <option value={3}>3 Stars (Satisfactory)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">
                  Deployment Scope Summary *
                </label>
                <input
                  type="text"
                  required
                  value={formData.deploymentSummary}
                  onChange={(e) => setFormData((p) => ({ ...p, deploymentSummary: e.target.value }))}
                  placeholder="e.g. Offline-First Ariiti POS + 3 Cashier Touch Terminals"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">
                  Verified Trust Tag
                </label>
                <input
                  type="text"
                  value={formData.verifiedTag}
                  onChange={(e) => setFormData((p) => ({ ...p, verifiedTag: e.target.value }))}
                  placeholder="e.g. Verified Commercial Deployment"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">
                  Customer Testimonial Quote *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => setFormData((p) => ({ ...p, quote: e.target.value }))}
                  placeholder="Direct client feedback regarding the system reliability, deployment quality, speed..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isTestimonialPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData((p) => ({ ...p, isPublished: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                />
                <label htmlFor="isTestimonialPublished" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Publish testimonial on public home page and reviews section
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Update Testimonial" : "Create Testimonial"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
