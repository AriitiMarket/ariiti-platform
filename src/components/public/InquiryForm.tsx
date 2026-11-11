"use client";

import React, { useState, useEffect, useTransition } from "react";
import { createCustomerInquiry } from "@/actions/inquiryActions";
import { buildWhatsAppUrl } from "@/lib/utils";
import Button from "@/components/ui/Button";
import {
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Send,
  RotateCcw,
  Sparkles,
  Info,
  Shield,
  Layers,
} from "lucide-react";

export interface InquiryFormProps {
  services: Array<{ id: string; title: string; slug: string; category: string }>;
  products: Array<{ id: string; name: string; slug: string; status: string }>;
  whatsappNumber: string;
  initialContext?: {
    category?: string;
    serviceSlug?: string;
    productSlug?: string;
    caseStudySlug?: string;
  };
}

const CATEGORY_OPTIONS = [
  { value: "SOFTWARE_DEVELOPMENT", label: "Software Systems & Web Development" },
  { value: "NETWORKING_INFRASTRUCTURE", label: "Networking & IT Infrastructure (LAN/Wi-Fi)" },
  { value: "HARDWARE_EQUIPMENT", label: "POS Hardware & Peripheral Equipment" },
  { value: "IT_MAINTENANCE_SUPPORT", label: "Preventive IT Maintenance & SLA Support" },
  { value: "PRODUCT_INQUIRY", label: "Ariiti Proprietary Software Products" },
  { value: "GENERAL", label: "General Technology Consultation" },
];

const LOCATION_OPTIONS = [
  "Dire Dawa",
  "Harar",
  "Jijiga",
  "Adama",
  "Addis Ababa",
  "Other (Specify in description)",
];

const DRAFT_STORAGE_KEY = "ariiti_inquiry_draft";

export const InquiryForm: React.FC<InquiryFormProps> = ({
  services = [],
  products = [],
  whatsappNumber,
  initialContext = {},
}) => {
  const [isPending, startTransition] = useTransition();

  // Form input state
  const [customerName, setCustomerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceCategory, setServiceCategory] = useState("SOFTWARE_DEVELOPMENT");
  const [requestedServiceTitle, setRequestedServiceTitle] = useState("");
  const [location, setLocation] = useState("Dire Dawa");
  const [projectDescription, setProjectDescription] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // UI status state
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);

  // Initialize form with initialContext or cached localStorage draft
  useEffect(() => {
    // 1. First, check if explicit URL query parameters were passed
    let matchedCategory = initialContext.category || "";
    let matchedTitle = "";

    if (initialContext.productSlug) {
      matchedCategory = "PRODUCT_INQUIRY";
      const product = products.find((p) => p.slug === initialContext.productSlug);
      if (product) {
        matchedTitle = product.name;
      }
    } else if (initialContext.serviceSlug) {
      const s = services.find((serv) => serv.slug === initialContext.serviceSlug);
      if (s) {
        matchedCategory = s.category;
        matchedTitle = s.title;
      }
    }

    // 2. Load draft from localStorage if present
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.customerName) setCustomerName(parsed.customerName);
        if (parsed.businessName) setBusinessName(parsed.businessName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.projectDescription) setProjectDescription(parsed.projectDescription);

        // Only restore category and title from draft if URL didn't explicitly override it
        if (!matchedCategory && parsed.serviceCategory) {
          setServiceCategory(parsed.serviceCategory);
        }
        if (!matchedTitle && parsed.requestedServiceTitle) {
          setRequestedServiceTitle(parsed.requestedServiceTitle);
        }

        setHasRestoredDraft(true);
      }
    } catch (e) {
      console.warn("Failed to read draft from localStorage:", e);
    }

    // Apply URL parameters if present
    if (matchedCategory) {
      setServiceCategory(matchedCategory);
    }
    if (matchedTitle) {
      setRequestedServiceTitle(matchedTitle);
    }
  }, [initialContext, services, products]);

  // Persist draft to localStorage on changes (debounced by React state updates)
  useEffect(() => {
    if (submittedReference) return; // Do not save once submitted

    try {
      const draft = {
        customerName,
        businessName,
        phone,
        email,
        serviceCategory,
        requestedServiceTitle,
        location,
        projectDescription,
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage errors in private browsing modes
    }
  }, [
    customerName,
    businessName,
    phone,
    email,
    serviceCategory,
    requestedServiceTitle,
    location,
    projectDescription,
    submittedReference,
  ]);

  // Dynamic dropdown list based on selected category
  const dynamicServiceOptions: string[] = React.useMemo(() => {
    if (serviceCategory === "PRODUCT_INQUIRY") {
      return products.map((p) => p.name);
    }
    const filtered = services.filter((s) => s.category === serviceCategory);
    if (filtered.length > 0) {
      return filtered.map((s) => s.title);
    }
    return [];
  }, [serviceCategory, services, products]);

  // Auto-set the requested title when options change if not already set
  useEffect(() => {
    if (dynamicServiceOptions.length > 0 && !requestedServiceTitle) {
      setRequestedServiceTitle(dynamicServiceOptions[0]);
    }
  }, [dynamicServiceOptions, requestedServiceTitle]);

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
    setCustomerName("");
    setBusinessName("");
    setPhone("");
    setEmail("");
    setProjectDescription("");
    setFieldErrors({});
    setFormError(null);
    setHasRestoredDraft(false);
  };

  const handleResetForm = () => {
    handleClearDraft();
    setSubmittedReference(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const payload = {
      customerName,
      businessName: businessName || undefined,
      phone,
      email: email || undefined,
      serviceCategory,
      requestedServiceTitle: requestedServiceTitle || "General Inquiry",
      location,
      projectDescription,
      honeypot: honeypot || undefined,
      referralContext: {
        sourcePage: typeof window !== "undefined" ? window.location.pathname : "/contact",
        caseStudySlug: initialContext.caseStudySlug,
        productSlug: initialContext.productSlug,
      },
    };

    startTransition(async () => {
      const result = await createCustomerInquiry(payload);

      if (!result.success) {
        setFormError(result.error || "Please check the highlighted form errors.");
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        return;
      }

      // Success: Clear localStorage draft and show confirmation
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {}
      setSubmittedReference(result.referenceId || "CONFIRMED");
    });
  };

  // WhatsApp quick handoff URL with whatever the user has typed so far
  const currentWhatsAppUrl = buildWhatsAppUrl(whatsappNumber, {
    name: customerName,
    service: requestedServiceTitle || serviceCategory,
    location,
    details: projectDescription,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // CONFIRMATION STATE CARD
  // ───────────────────────────────────────────────────────────────────────────
  if (submittedReference) {
    const confirmationWhatsAppUrl = buildWhatsAppUrl(whatsappNumber, {
      name: customerName,
      service: requestedServiceTitle,
      details: `Priority Follow-up for Inquiry Ref #${submittedReference}.`,
    });

    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-8 sm:p-10 shadow-lg animate-in fade-in duration-200">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Inquiry Logged Successfully
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-ariiti-navy mt-4 mb-2">
            Thank You, {customerName}!
          </h2>

          <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
              Official Reference Tracking ID:
            </span>
            <span className="text-2xl font-mono font-black text-ariiti-accent tracking-wider">
              #{submittedReference}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            Our engineering and operations team has received your technical specifications. An Ariiti Tech specialist will review your requirements and reach out via phone or email within <strong>2 to 4 business hours</strong>.
          </p>

          <div className="space-y-3">
            <a
              href={confirmationWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Reference via WhatsApp for Immediate Priority</span>
            </a>

            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs font-semibold text-slate-500 hover:text-ariiti-navy underline block mx-auto pt-2"
            >
              Submit Another Project Requirement
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // INTERACTIVE INQUIRY FORM
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm relative">
      {/* Case Study Context Banner */}
      {initialContext.caseStudySlug && (
        <div className="mb-6 p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
          <Info className="w-4 h-4 text-ariiti-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Contextual Inquiry:</span> You are inquiring about a technical solution similar to our published deployment:{" "}
            <span className="font-mono font-semibold underline">
              {initialContext.caseStudySlug}
            </span>.
          </div>
        </div>
      )}

      {/* Restored Draft Notice */}
      {hasRestoredDraft && (
        <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 text-ariiti-accent" />
            <span>Restored your unfinished draft from browser storage.</span>
          </div>
          <button
            type="button"
            onClick={handleClearDraft}
            className="text-[11px] font-bold text-red-600 hover:underline"
          >
            Clear draft
          </button>
        </div>
      )}

      {/* Form Error Alert */}
      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Submission Blocked</p>
            <p>{formError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Anti-Spam Honeypot Field (Invisible to human users) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company_title_verification">Leave Blank</label>
          <input
            id="company_title_verification"
            type="text"
            name="honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* 1. Name & Business */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="customerName"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g., Mohammed Al-Harari"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ariiti-accent ${
                fieldErrors.customerName
                  ? "border-red-400 bg-red-50/30"
                  : "border-slate-300 focus:border-ariiti-accent"
              }`}
            />
            {fieldErrors.customerName && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.customerName[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="businessName"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Business / Organization <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g., Harar Wholesale Traders"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ariiti-accent focus:border-ariiti-accent"
            />
          </div>
        </div>

        {/* 2. Contact Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 0911234567 or +2519..."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ariiti-accent ${
                fieldErrors.phone
                  ? "border-red-400 bg-red-50/30"
                  : "border-slate-300 focus:border-ariiti-accent"
              }`}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Ethiopian (09/07...) or international format
            </p>
            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.phone[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Email Address <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ariiti-accent ${
                fieldErrors.email
                  ? "border-red-400 bg-red-50/30"
                  : "border-slate-300 focus:border-ariiti-accent"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>
            )}
          </div>
        </div>

        {/* 3. Category & Specific Product/Service Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="serviceCategory"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Service Division <span className="text-red-500">*</span>
            </label>
            <select
              id="serviceCategory"
              value={serviceCategory}
              onChange={(e) => {
                setServiceCategory(e.target.value);
                setRequestedServiceTitle(""); // Reset title so dynamic options pick up
              }}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ariiti-accent focus:border-ariiti-accent"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="requestedServiceTitle"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Specific Service / Product <span className="text-red-500">*</span>
            </label>
            {dynamicServiceOptions.length > 0 ? (
              <select
                id="requestedServiceTitle"
                value={requestedServiceTitle}
                onChange={(e) => setRequestedServiceTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ariiti-accent focus:border-ariiti-accent"
              >
                {dynamicServiceOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
                <option value="Other / Custom Technical Requirement">
                  Other / Custom Technical Requirement
                </option>
              </select>
            ) : (
              <input
                id="requestedServiceTitle"
                type="text"
                required
                value={requestedServiceTitle}
                onChange={(e) => setRequestedServiceTitle(e.target.value)}
                placeholder="e.g., Multi-floor Wi-Fi or Custom Software"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ariiti-accent focus:border-ariiti-accent"
              />
            )}
            {fieldErrors.requestedServiceTitle && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.requestedServiceTitle[0]}
              </p>
            )}
          </div>
        </div>

        {/* 4. Location Dropdown */}
        <div>
          <label
            htmlFor="location"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Project Location / City <span className="text-red-500">*</span>
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ariiti-accent focus:border-ariiti-accent"
          >
            {LOCATION_OPTIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {fieldErrors.location && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.location[0]}</p>
          )}
        </div>

        {/* 5. Project Description */}
        <div>
          <label
            htmlFor="projectDescription"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Project Description & Requirements <span className="text-red-500">*</span>
          </label>
          <textarea
            id="projectDescription"
            required
            rows={4}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Please detail your operational needs (e.g., number of computers/workstations, floor count, current internet bottlenecks, software features, or timeline)."
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ariiti-accent ${
              fieldErrors.projectDescription
                ? "border-red-400 bg-red-50/30"
                : "border-slate-300 focus:border-ariiti-accent"
            }`}
          />
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>Minimum 10 characters required</span>
            <span>{projectDescription.length} characters</span>
          </div>
          {fieldErrors.projectDescription && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.projectDescription[0]}
            </p>
          )}
        </div>

        {/* Dual Action Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isPending}
            className="shadow-md justify-center"
          >
            <Send className="w-4 h-4 mr-2" />
            <span>{isPending ? "Submitting Inquiry..." : "Submit Formal Inquiry"}</span>
          </Button>

          <a
            href={currentWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border-2 border-emerald-600 text-emerald-700 text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-emerald-50 active:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Chat Directly on WhatsApp</span>
          </a>
        </div>

        {/* Offline & Privacy Reassurance */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
          <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            Draft auto-saved to browser storage. Your technical data is protected by strict corporate confidentiality.
          </span>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
