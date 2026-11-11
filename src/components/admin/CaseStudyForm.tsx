"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { upsertCaseStudy } from "@/actions/adminCmsActions";
import { slugify } from "@/lib/utils";

interface CaseStudyFormProps {
  initialData?: {
    _id?: string;
    title?: string;
    slug?: string;
    category?: string;
    projectType?: string;
    clientSector?: string;
    clientName?: string;
    isClientConfidential?: boolean;
    location?: string;
    summary?: string;
    problemAddressed?: string;
    solutionImplemented?: string;
    technologiesAndEquipment?: string[];
    measurableOutcomes?: string[];
    coverImageUrl?: string;
    galleryImageUrls?: string[];
    liveOrDemoUrl?: string;
    projectStatus?: string;
    publicationStatus?: string;
    isFeatured?: boolean;
    displayOrder?: number;
  };
  isEditing?: boolean;
}

export const CaseStudyForm: React.FC<CaseStudyFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(
    initialData?.category || "SOFTWARE_DEVELOPMENT"
  );
  const [projectType, setProjectType] = useState(
    initialData?.projectType || "CLIENT_DEPLOYMENT"
  );
  const [clientSector, setClientSector] = useState(
    initialData?.clientSector || ""
  );
  const [clientName, setClientName] = useState(initialData?.clientName || "");
  const [isClientConfidential, setIsClientConfidential] = useState(
    initialData?.isClientConfidential ?? true
  );
  const [location, setLocation] = useState(
    initialData?.location || "Harar & Dire Dawa"
  );
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [problemAddressed, setProblemAddressed] = useState(
    initialData?.problemAddressed || ""
  );
  const [solutionImplemented, setSolutionImplemented] = useState(
    initialData?.solutionImplemented || ""
  );

  // Technologies & Hardware Array
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>(
    initialData?.technologiesAndEquipment || []
  );

  // Measurable Outcomes
  const [outcomes, setOutcomes] = useState<string[]>(
    initialData?.measurableOutcomes && initialData.measurableOutcomes.length > 0
      ? initialData.measurableOutcomes
      : [""]
  );

  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.coverImageUrl ||
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80"
  );
  const [liveOrDemoUrl, setLiveOrDemoUrl] = useState(
    initialData?.liveOrDemoUrl || ""
  );
  const [projectStatus, setProjectStatus] = useState(
    initialData?.projectStatus || "COMPLETED"
  );
  const [publicationStatus, setPublicationStatus] = useState(
    initialData?.publicationStatus || "PUBLISHED"
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured || false
  );
  const [displayOrder, setDisplayOrder] = useState(
    initialData?.displayOrder || 0
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      setSlug(slugify(val));
    }
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    const item = techInput.trim();
    if (!technologies.includes(item)) {
      setTechnologies([...technologies, item]);
    }
    setTechInput("");
  };

  const removeTech = (item: string) => {
    setTechnologies(technologies.filter((t) => t !== item));
  };

  const handleOutcomeChange = (index: number, val: string) => {
    const updated = [...outcomes];
    updated[index] = val;
    setOutcomes(updated);
  };

  const addOutcomeRow = () => {
    setOutcomes([...outcomes, ""]);
  };

  const removeOutcomeRow = (index: number) => {
    if (outcomes.length === 1) return;
    setOutcomes(outcomes.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (technologies.length === 0) {
      setError("Please add at least one technology, tool, or hardware equipment spec.");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category: category as
        | "SOFTWARE_DEVELOPMENT"
        | "NETWORKING_INFRASTRUCTURE"
        | "HARDWARE_EQUIPMENT"
        | "IT_MAINTENANCE_SUPPORT",
      projectType: projectType as
        | "CLIENT_DEPLOYMENT"
        | "INTERNAL_ECOSYSTEM_PRODUCT"
        | "TECHNICAL_DEMONSTRATION",
      clientSector: clientSector.trim(),
      clientName: isClientConfidential ? undefined : clientName.trim(),
      isClientConfidential,
      location: location.trim(),
      summary: summary.trim(),
      problemAddressed: problemAddressed.trim(),
      solutionImplemented: solutionImplemented.trim(),
      technologiesAndEquipment: technologies,
      measurableOutcomes: outcomes.map((o) => o.trim()).filter(Boolean),
      coverImageUrl: coverImageUrl.trim(),
      liveOrDemoUrl: liveOrDemoUrl.trim() || undefined,
      projectStatus: projectStatus as
        | "COMPLETED"
        | "ONGOING_SUPPORT"
        | "PILOT_STAGE",
      publicationStatus: publicationStatus as "PUBLISHED" | "DRAFT" | "ARCHIVED",
      isFeatured,
      displayOrder: Number(displayOrder),
    };

    startTransition(async () => {
      const res = await upsertCaseStudy(payload, initialData?._id);
      if (!res.success) {
        setError(res.error || "Failed to save case study.");
      } else {
        router.push("/admin/case-studies");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Core Identification: White background, subtle border */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm text-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary font-mono">
          1. General Case Study Identity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Enterprise Multi-Floor Cat6 Structured Cabling & UniFi APs"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="enterprise-multifloor-cabling"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Service Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
            >
              <option value="SOFTWARE_DEVELOPMENT">Software Development</option>
              <option value="NETWORKING_INFRASTRUCTURE">Networking &amp; IT Infrastructure</option>
              <option value="HARDWARE_EQUIPMENT">Hardware &amp; POS Equipment</option>
              <option value="IT_MAINTENANCE_SUPPORT">IT Maintenance &amp; SLAs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Project Classification *
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
            >
              <option value="CLIENT_DEPLOYMENT">Commercial Client Deployment</option>
              <option value="INTERNAL_ECOSYSTEM_PRODUCT">Internal Ecosystem Product</option>
              <option value="TECHNICAL_DEMONSTRATION">Technical Reference Architecture</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Location (City/Region) *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Harar, Dire Dawa, Aweday, etc."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* 2. Client Attribution & NDA Privacy */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm text-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary font-mono">
          2. Client Attribution &amp; Confidentiality
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Client Commercial Sector *
            </label>
            <input
              type="text"
              required
              value={clientSector}
              onChange={(e) => setClientSector(e.target.value)}
              placeholder="Retail & Wholesale, Hospitality, Healthcare, etc."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Client Organization Name
            </label>
            <input
              type="text"
              disabled={isClientConfidential}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder={isClientConfidential ? "Hidden by NDA" : "Company Name"}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:opacity-40 shadow-xs"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isClientConfidential}
                onChange={(e) => setIsClientConfidential(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-xs font-semibold text-slate-700">
                Enforce Client NDA Confidentiality (Renders as &quot;Confidential {clientSector || "Commercial"} Client&quot;)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Narrative & Technical Details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm text-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary font-mono">
          3. Technical Narrative
        </h3>

        <div>
          <label className="block text-xs font-bold text-brand-primary mb-1">
            Executive Summary * (20 - 300 characters)
          </label>
          <textarea
            required
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief high-level summary of the deployment for the public directory card..."
            className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-primary mb-1">
            Problem Addressed * (Min 50 characters)
          </label>
          <textarea
            required
            rows={3}
            value={problemAddressed}
            onChange={(e) => setProblemAddressed(e.target.value)}
            placeholder="Describe the operational failure, bottleneck, or network dead spots the business suffered prior to this deployment..."
            className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-primary mb-1">
            Solution Implemented * (Min 50 characters)
          </label>
          <textarea
            required
            rows={3}
            value={solutionImplemented}
            onChange={(e) => setSolutionImplemented(e.target.value)}
            placeholder="Detail the technical architecture, cabling standard, routing configuration, or software synchronization engine engineered..."
            className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
          />
        </div>
      </div>

      {/* 4. Equipment & Outcomes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm text-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary font-mono">
          4. Hardware, Stack &amp; Outcomes
        </h3>

        {/* Technologies tag input */}
        <div>
          <label className="block text-xs font-bold text-brand-primary mb-1">
            Technologies, Protocols &amp; Hardware Equipment *
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTech();
                }
              }}
              placeholder="e.g. Cat6 Solid Copper, MikroTik CCR, UniFi Enterprise APs"
              className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
            />
            <button
              type="button"
              onClick={addTech}
              className="px-3.5 py-2 rounded-xl bg-white border border-brand-primary hover:bg-slate-50 text-brand-primary text-xs font-bold shadow-xs"
            >
              Add Item
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {technologies.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-mono border border-slate-200"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeTech(item)}
                  className="text-slate-400 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Measurable Outcomes */}
        <div>
          <label className="block text-xs font-bold text-brand-primary mb-1">
            Measurable Project Outcomes
          </label>
          <div className="space-y-2">
            {outcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => handleOutcomeChange(idx, e.target.value)}
                  placeholder="e.g. 0-second checkout latency during ISP downtime"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
                />
                {outcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOutcomeRow(idx)}
                    className="p-2 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addOutcomeRow}
            className="mt-2 text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Outcome</span>
          </button>
        </div>
      </div>

      {/* 5. Publishing Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm text-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary font-mono">
          5. Media &amp; Publication Controls
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Cover Image URL *
            </label>
            <input
              type="url"
              required
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Live Demo or Access URL (Optional)
            </label>
            <input
              type="url"
              value={liveOrDemoUrl}
              onChange={(e) => setLiveOrDemoUrl(e.target.value)}
              placeholder="https://pos.ariititech.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Publication Status *
            </label>
            <select
              value={publicationStatus}
              onChange={(e) => setPublicationStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary font-bold font-mono shadow-xs"
            >
              <option value="PUBLISHED">PUBLISHED (Live on Public Directory)</option>
              <option value="DRAFT">DRAFT (Internal Review Only)</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Project Execution Status
            </label>
            <select
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-xs"
            >
              <option value="COMPLETED">COMPLETED</option>
              <option value="ONGOING_SUPPORT">ONGOING_SUPPORT</option>
              <option value="PILOT_STAGE">PILOT_STAGE</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-xs font-semibold text-slate-700">
                Feature on Public Homepage
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Action Bar: Secondary button (Cancel) and Primary button (Save) */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
        >
          Cancel &amp; Return
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Deploying to Database...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? "Update Case Study" : "Publish Case Study"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CaseStudyForm;
