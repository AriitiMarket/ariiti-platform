"use client";

import React, { useState, useTransition } from "react";
import {
  Box,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Edit3,
  Plus,
  Trash2,
  X,
  Save,
} from "lucide-react";
import {
  updateProductLifecycle,
  upsertProduct,
} from "@/actions/adminCmsActions";
import { slugify } from "@/lib/utils";

export interface SerializedProduct {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  status: string;
  accessOrDemoUrl?: string;
  targetCustomers?: string;
  mainFeatures?: string[];
  isFeatured: boolean;
  featuresCount: number;
}

interface ProductLifecycleManagerProps {
  initialProducts: SerializedProduct[];
}

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "AVAILABLE (Commercial Ready)" },
  { value: "TESTING", label: "TESTING (Beta Pilot Stage)" },
  { value: "IN_DEVELOPMENT", label: "IN_DEVELOPMENT (Active Roadmap)" },
  { value: "TEMPORARILY_UNAVAILABLE", label: "TEMPORARILY_UNAVAILABLE" },
];

const STATUS_BADGE_CLASSES: Record<string, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  TESTING: "bg-amber-50 text-amber-700 border-amber-200",
  IN_DEVELOPMENT: "bg-blue-50 text-brand-primary border-blue-200",
  TEMPORARILY_UNAVAILABLE: "bg-slate-100 text-slate-600 border-slate-200",
};

export const ProductLifecycleManager: React.FC<ProductLifecycleManagerProps> = ({
  initialProducts,
}) => {
  const [products, setProducts] = useState<SerializedProduct[]>(initialProducts);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  // Edit / Create Modal State
  const [editingProduct, setEditingProduct] = useState<SerializedProduct | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  // Modal Form Inputs
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formStatus, setFormStatus] = useState("IN_DEVELOPMENT");
  const [formDemoUrl, setFormDemoUrl] = useState("");
  const [formFeatures, setFormFeatures] = useState<string[]>([""]);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenEdit = (p: SerializedProduct) => {
    setEditingProduct(p);
    setIsCreating(false);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormTagline(p.tagline);
    setFormDescription(p.description);
    setFormTarget(p.targetCustomers || "");
    setFormStatus(p.status);
    setFormDemoUrl(p.accessOrDemoUrl || "");
    setFormFeatures(
      p.mainFeatures && p.mainFeatures.length > 0 ? p.mainFeatures : [""]
    );
    setFormIsFeatured(p.isFeatured);
    setFormError(null);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsCreating(true);
    setFormName("");
    setFormSlug("");
    setFormTagline("");
    setFormDescription("");
    setFormTarget("");
    setFormStatus("IN_DEVELOPMENT");
    setFormDemoUrl("");
    setFormFeatures([""]);
    setFormIsFeatured(false);
    setFormError(null);
  };

  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...formFeatures];
    updated[index] = val;
    setFormFeatures(updated);
  };

  const addFeatureRow = () => {
    setFormFeatures([...formFeatures, ""]);
  };

  const removeFeatureRow = (index: number) => {
    if (formFeatures.length === 1) return;
    setFormFeatures(formFeatures.filter((_, idx) => idx !== index));
  };

  const handleQuickStatusChange = (productId: string, newStatus: string) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, status: newStatus } : p))
    );

    startTransition(async () => {
      const res = await updateProductLifecycle(productId, newStatus);
      if (!res.success) {
        setFeedback(res.error || "Failed to update lifecycle status.");
        setProducts(initialProducts);
      } else {
        setFeedback("Product lifecycle status updated & cache invalidated.");
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const payload = {
      name: formName.trim(),
      slug: formSlug.trim(),
      tagline: formTagline.trim(),
      description: formDescription.trim(),
      targetCustomers: formTarget.trim() || undefined,
      status: formStatus as
        | "IN_DEVELOPMENT"
        | "TESTING"
        | "AVAILABLE"
        | "TEMPORARILY_UNAVAILABLE",
      accessOrDemoUrl: formDemoUrl.trim() || undefined,
      mainFeatures: formFeatures.map((f) => f.trim()).filter(Boolean),
      isFeatured: formIsFeatured,
    };

    startTransition(async () => {
      const res = await upsertProduct(payload, editingProduct?._id);
      if (!res.success) {
        setFormError(res.error || "Failed to save product specifications.");
      } else {
        setFeedback("Product saved successfully.");
        setTimeout(() => setFeedback(null), 3000);
        setEditingProduct(null);
        setIsCreating(false);

        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) =>
              p._id === editingProduct._id
                ? {
                    ...p,
                    ...payload,
                    featuresCount: payload.mainFeatures.length,
                  }
                : p
            )
          );
        } else if (res.id) {
          setProducts((prev) => [
            ...prev,
            {
              _id: res.id,
              ...payload,
              featuresCount: payload.mainFeatures.length,
            },
          ]);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Feedback Alert */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-xs font-mono text-slate-500">
          Showing {products.length} Proprietary Software Products
        </span>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Grid: White backgrounds with subtle borders and shadows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => {
          const badgeClass =
            STATUS_BADGE_CLASSES[product.status] ||
            STATUS_BADGE_CLASSES.IN_DEVELOPMENT;

          return (
            <div
              key={product._id}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm text-left text-slate-900"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-lg shadow-xs">
                      {product.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-brand-primary">
                        {product.name}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        /{product.slug}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${badgeClass}`}
                  >
                    {product.status}
                  </span>
                </div>

                <p className="text-xs font-bold text-brand-primary mb-2">
                  {product.tagline}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {product.description}
                </p>

                {product.targetCustomers && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 mb-4">
                    <span className="font-bold text-brand-primary">Audience: </span>
                    <span className="line-clamp-1">{product.targetCustomers}</span>
                  </div>
                )}
              </div>

              {/* Lifecycle Controller & Edit Trigger */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Status:
                  </label>
                  <select
                    value={product.status}
                    disabled={isPending}
                    onChange={(e) =>
                      handleQuickStatusChange(product._id, e.target.value)
                    }
                    className={`text-xs font-bold font-mono px-2.5 py-1 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer shadow-xs ${badgeClass}`}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {/* Secondary button: White with deep navy borders and text */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(product)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-brand-primary text-xs font-bold transition-colors border border-brand-primary shadow-xs"
                  >
                    <Edit3 className="w-3 h-3 text-brand-primary" />
                    <span>Edit Specs</span>
                  </button>

                  {product.accessOrDemoUrl && (
                    <a
                      href={product.accessOrDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-brand-primary hover:bg-slate-50"
                      title="Launch URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Product Modal */}
      {(editingProduct || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left animate-in zoom-in-95 duration-150 text-slate-900"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-brand-primary" />
                <h3 className="text-sm font-bold text-brand-primary">
                  {isCreating
                    ? "Add New Ecosystem Software Product"
                    : `Edit Specifications: ${formName}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreating(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="m-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {formError}
              </div>
            )}

            <form
              onSubmit={handleFormSubmit}
              className="p-5 overflow-y-auto space-y-4 flex-1 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-primary mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (isCreating) setFormSlug(slugify(e.target.value));
                    }}
                    placeholder="e.g. Ariiti SupplySync"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-primary mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(slugify(e.target.value))}
                    placeholder="ariiti-supplysync"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-brand-primary mb-1">
                    Commercial Tagline * (5 - 160 characters)
                  </label>
                  <input
                    type="text"
                    required
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="Ultra-fast, offline-resilient Point of Sale for retail and hospitality."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-brand-primary mb-1">
                    Architectural Description * (Min 50 characters)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detail the technical architecture, offline sync engine, and peripheral support..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-primary mb-1">
                    Target Deployment Customers
                  </label>
                  <input
                    type="text"
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    placeholder="Supermarkets, pharmacies, distributors"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-primary mb-1">
                    Lifecycle Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-brand-primary mb-1">
                    Live Demo / Access URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formDemoUrl}
                    onChange={(e) => setFormDemoUrl(e.target.value)}
                    placeholder="https://pos.ariititech.com"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
                  />
                </div>
              </div>

              {/* Main Features Dynamic List */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-brand-primary">
                    Core Technical Features *
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureRow}
                    className="text-brand-primary hover:underline font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder="e.g. Offline SQLite sync to cloud MongoDB"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-primary shadow-xs"
                      />
                      {formFeatures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Flag */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                />
                <label
                  htmlFor="isFeatured"
                  className="font-semibold text-slate-700 cursor-pointer"
                >
                  Feature as Flagship Product on Homepage
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>
                        {isCreating ? "Publish Product" : "Update Specifications"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductLifecycleManager;
