"use client";

import React, { useState } from "react";
import {
  Wrench,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { upsertService, deleteService } from "@/actions/adminCmsActions";

interface ServiceItem {
  _id: string;
  title: string;
  slug: string;
  category: "SOFTWARE_DEVELOPMENT" | "NETWORKING_INFRASTRUCTURE" | "HARDWARE_EQUIPMENT" | "IT_MAINTENANCE_SUPPORT";
  summary: string;
  description: string;
  targetCustomers: string;
  problemsSolved: string[];
  whatsIncluded: string[];
  isActive: boolean;
  displayOrder: number;
}

interface ServicesManagerProps {
  initialServices: ServiceItem[];
}

const CATEGORIES = [
  { value: "ALL", label: "All Categories" },
  { value: "SOFTWARE_DEVELOPMENT", label: "Software Solutions" },
  { value: "NETWORKING_INFRASTRUCTURE", label: "Networking Infrastructure" },
  { value: "HARDWARE_EQUIPMENT", label: "Hardware & Support" },
  { value: "IT_MAINTENANCE_SUPPORT", label: "IT Maintenance & SLA" },
];

export const ServicesManager: React.FC<ServicesManagerProps> = ({ initialServices }) => {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "SOFTWARE_DEVELOPMENT" as ServiceItem["category"],
    summary: "",
    description: "",
    targetCustomers: "",
    problemsSolved: "",
    whatsIncluded: "",
    isActive: true,
    displayOrder: 0,
  });

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      category: "SOFTWARE_DEVELOPMENT",
      summary: "",
      description: "",
      targetCustomers: "",
      problemsSolved: "",
      whatsIncluded: "",
      isActive: true,
      displayOrder: services.length + 1,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (svc: ServiceItem) => {
    setEditingService(svc);
    setFormData({
      title: svc.title,
      slug: svc.slug,
      category: svc.category,
      summary: svc.summary,
      description: svc.description,
      targetCustomers: svc.targetCustomers,
      problemsSolved: (svc.problemsSolved || []).join("\n"),
      whatsIncluded: (svc.whatsIncluded || []).join("\n"),
      isActive: svc.isActive,
      displayOrder: svc.displayOrder || 0,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingService ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        category: formData.category,
        summary: formData.summary.trim(),
        description: formData.description.trim(),
        targetCustomers: formData.targetCustomers.trim(),
        problemsSolved: formData.problemsSolved
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        whatsIncluded: formData.whatsIncluded
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        isActive: formData.isActive,
        displayOrder: Number(formData.displayOrder) || 0,
      };

      const res = await upsertService(payload, editingService?._id);
      if (res.success && res.id) {
        const item: ServiceItem = {
          _id: res.id,
          ...payload,
        };
        if (editingService) {
          setServices((prev) =>
            prev.map((s) => (s._id === editingService._id ? item : s))
          );
        } else {
          setServices((prev) => [item, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        setFormError(res.error || "Failed to save service.");
      }
    } catch {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (svc: ServiceItem) => {
    const updated = !svc.isActive;
    const res = await upsertService({ isActive: updated }, svc._id);
    if (res.success) {
      setServices((prev) =>
        prev.map((s) => (s._id === svc._id ? { ...s, isActive: updated } : s))
      );
    }
  };

  const handleDelete = async (svcId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete service "${title}"?`)) {
      return;
    }
    const res = await deleteService(svcId);
    if (res.success) {
      setServices((prev) => prev.filter((s) => s._id !== svcId));
    } else {
      alert(res.error || "Failed to delete service.");
    }
  };

  const filteredServices = services.filter((svc) => {
    const matchesCategory =
      selectedCategory === "ALL" || svc.category === selectedCategory;
    const matchesSearch =
      svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-brand-primary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-brand-primary text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {cat.label}
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
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table: White background, readable text, subtle separators */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                <th className="py-3.5 px-4">Service Name &amp; Slug</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Summary</th>
                <th className="py-3.5 px-4 text-center">Order</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No services found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredServices.map((svc) => (
                  <tr key={svc._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 leading-tight">
                        {svc.title}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                        /{svc.slug}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-brand-primary font-semibold border border-blue-200">
                        {svc.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {svc.summary}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                      {svc.displayOrder}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(svc)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors ${
                          svc.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        {svc.isActive ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>ACTIVE</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>INACTIVE</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(svc)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-brand-primary hover:border-brand-primary transition-colors shadow-xs"
                          title="Edit Service"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(svc._id, svc.title)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 hover:border-red-300 transition-colors shadow-xs"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal: White background, clear neutral borders, navy headings & labels */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative my-8 text-slate-900">
            <h3 className="text-lg font-bold text-brand-primary tracking-tight mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-brand-primary" />
              <span>{editingService ? "Edit Service" : "Add New Enterprise Service"}</span>
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
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Turnkey Structured Cabling & Rack Setup"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="structured-cabling"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        category: e.target.value as ServiceItem["category"],
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                  >
                    <option value="SOFTWARE_DEVELOPMENT">Software Solutions</option>
                    <option value="NETWORKING_INFRASTRUCTURE">Networking Infrastructure</option>
                    <option value="HARDWARE_EQUIPMENT">Hardware Equipment &amp; POS</option>
                    <option value="IT_MAINTENANCE_SUPPORT">IT Maintenance &amp; SLA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, displayOrder: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">
                  Summary (Short description for cards) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData((p) => ({ ...p, summary: e.target.value }))}
                  placeholder="Certified Cat6 copper drops, patch panels, and server rack installations."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">
                  Full Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Detailed explanation of the technical scope, standards, and equipment..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">
                  Target Customers *
                </label>
                <input
                  type="text"
                  required
                  value={formData.targetCustomers}
                  onChange={(e) => setFormData((p) => ({ ...p, targetCustomers: e.target.value }))}
                  placeholder="Commercial buildings, hotels, clinics, banks in Eastern Ethiopia"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    Problems Solved (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.problemsSolved}
                    onChange={(e) => setFormData((p) => ({ ...p, problemsSolved: e.target.value }))}
                    placeholder="Tangled messy cables&#10;Intermittent connection drops&#10;Lack of port labeling"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono text-[11px] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-primary mb-1">
                    What&apos;s Included (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.whatsIncluded}
                    onChange={(e) => setFormData((p) => ({ ...p, whatsIncluded: e.target.value }))}
                    placeholder="Cat6 certified copper cables&#10;Patch panel & cable management&#10;Fluke wire testing report"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono text-[11px] shadow-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Publish service live on public website
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
                  <span>{editingService ? "Update Service" : "Create Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
