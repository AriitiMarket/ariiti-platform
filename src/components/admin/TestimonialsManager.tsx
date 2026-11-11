"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Search,
  Loader2,
  AlertCircle,
  Building2,
  MapPin,
  ShieldCheck,
  Quote,
} from "lucide-react";
import { upsertTestimonial, deleteTestimonial } from "@/actions/adminCmsActions";

export interface TestimonialItem {
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
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    quote: "",
    clientType: "",
    clientName: "",
    location: "Harar, Eastern Ethiopia",
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
      location: "Harar, Eastern Ethiopia",
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

    const payload = {
      quote: formData.quote.trim(),
      clientType: formData.clientType.trim(),
      clientName: formData.clientName.trim(),
      location: formData.location.trim(),
      deploymentSummary: formData.deploymentSummary.trim(),
      verifiedTag: formData.verifiedTag.trim(),
      rating: Number(formData.rating) || 5,
      isPublished: formData.isPublished,
      displayOrder: Number(formData.displayOrder) || 0,
    };

    try {
      const res = await upsertTestimonial(payload, editingItem?._id);
      if (res.success && res.id) {
        const updated: TestimonialItem = {
          _id: res.id,
          ...payload,
          createdAt: editingItem?.createdAt || new Date().toISOString(),
        };

        if (editingItem) {
          setTestimonials((prev) =>
            prev.map((t) => (t._id === editingItem._id ? updated : t))
          );
        } else {
          setTestimonials((prev) => [updated, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        setFormError(res.error || "Failed to save testimonial.");
      }
    } catch (err: unknown) {
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search testimonials by client, quote, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ariiti-accent"
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
                    ? "bg-ariiti-accent text-white"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-ariiti-accent hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            No testimonials found matching your criteria.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    {item.clientType}
                  </span>
                  {item.clientName && (
                    <span className="text-xs text-slate-400">
                      ({item.clientName})
                    </span>
                  )}
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {item.location}
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {item.verifiedTag}
                  </span>

                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${
                      item.isPublished
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {item.isPublished ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>LIVE</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-slate-500" />
                        <span>HIDDEN</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Edit Testimonial"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.clientType)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 mb-3">
                <Quote className="w-4 h-4 text-ariiti-accent shrink-0 mt-0.5" />
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 px-3.5 py-2 rounded-xl flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="truncate pr-2">
                  <strong className="text-slate-300">Deployment:</strong> {item.deploymentSummary}
                </span>
                <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Testimonial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative my-8">
            <h3 className="text-lg font-bold text-white tracking-tight mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-ariiti-accent" />
              <span>{editingItem ? "Edit Client Testimonial" : "Add Verified Testimonial"}</span>
            </h3>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Client / Organization Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientType}
                    onChange={(e) => setFormData((p) => ({ ...p, clientType: e.target.value }))}
                    placeholder="e.g. Commercial Supermarket & Retailer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ariiti-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Client Name / Representative (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData((p) => ({ ...p, clientName: e.target.value }))}
                    placeholder="e.g. Operations General Manager"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ariiti-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Commercial Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Harar Commercial Corridor"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ariiti-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Star Rating (1 - 5) *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData((p) => ({ ...p, rating: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-ariiti-accent"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Strong)</option>
                    <option value={3}>3 Stars (Satisfactory)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deployment Scope Summary *
                </label>
                <input
                  type="text"
                  required
                  value={formData.deploymentSummary}
                  onChange={(e) => setFormData((p) => ({ ...p, deploymentSummary: e.target.value }))}
                  placeholder="e.g. Offline-First Ariiti POS + 3 Cashier Touch Terminals"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ariiti-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Verified Trust Tag
                </label>
                <input
                  type="text"
                  value={formData.verifiedTag}
                  onChange={(e) => setFormData((p) => ({ ...p, verifiedTag: e.target.value }))}
                  placeholder="e.g. Verified Commercial Deployment"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ariiti-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Customer Testimonial Quote *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => setFormData((p) => ({ ...p, quote: e.target.value }))}
                  placeholder="Direct client feedback regarding the system reliability, deployment quality, speed..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ariiti-accent"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isTestimonialPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData((p) => ({ ...p, isPublished: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-700 text-ariiti-accent focus:ring-ariiti-accent"
                />
                <label htmlFor="isTestimonialPublished" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Publish testimonial on public home page and reviews section
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-ariiti-accent hover:bg-blue-600 text-white text-xs font-bold transition-all disabled:opacity-50"
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
