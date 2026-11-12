"use client";

import React from "react";
import { Briefcase, Loader2 } from "lucide-react";

export interface MemberFormData {
  name: string;
  role: string;
  department: string;
  bio: string;
  location: string;
  skills: string;
  imageUrl: string;
  inquiryTopic: string;
  inquiryHref: string;
  order: number;
  isActive: boolean;
}

interface MemberModalProps {
  isOpen: boolean;
  isEditing: boolean;
  form: MemberFormData;
  error: string;
  isSubmitting: boolean;
  onChange: React.Dispatch<React.SetStateAction<MemberFormData>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  isEditing,
  form,
  error,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-brand-primary tracking-tight mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-primary" />
          <span>{isEditing ? "Edit Team Member" : "Add Team Member"}</span>
        </h3>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Staff Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => onChange((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Lead Systems Architect"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Role Title *
              </label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => onChange((p) => ({ ...p, role: e.target.value }))}
                placeholder="e.g. Head of Software Engineering"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Department / Unit *
              </label>
              <input
                type="text"
                required
                value={form.department}
                onChange={(e) => onChange((p) => ({ ...p, department: e.target.value }))}
                placeholder="e.g. Ariiti POS & Commerce Unit"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Location Station *
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => onChange((p) => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Harar Operations Center"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-brand-primary mb-1">
              Professional Bio *
            </label>
            <textarea
              rows={3}
              required
              value={form.bio}
              onChange={(e) => onChange((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Specializing in local-first browser databases, hardware ESC/POS protocols..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block font-semibold text-brand-primary mb-1">
              Core Skills / Competencies * (comma-separated)
            </label>
            <input
              type="text"
              required
              value={form.skills}
              onChange={(e) => onChange((p) => ({ ...p, skills: e.target.value }))}
              placeholder="TypeScript, Next.js, IndexedDB, ESC/POS, MongoDB"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Photo / Image URL
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => onChange((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => onChange((p) => ({ ...p, order: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Inquiry Topic
              </label>
              <input
                type="text"
                value={form.inquiryTopic}
                onChange={(e) => onChange((p) => ({ ...p, inquiryTopic: e.target.value }))}
                placeholder="e.g. Software Architecture Consultation"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Inquiry Link Href
              </label>
              <input
                type="text"
                value={form.inquiryHref}
                onChange={(e) => onChange((p) => ({ ...p, inquiryHref: e.target.value }))}
                placeholder="/contact?category=SOFTWARE_DEVELOPMENT"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="memberActive"
              checked={form.isActive}
              onChange={(e) => onChange((p) => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="memberActive" className="font-semibold text-slate-700 cursor-pointer">
              Active (Published on public website)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white font-bold transition-all disabled:opacity-50 shadow-sm"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
