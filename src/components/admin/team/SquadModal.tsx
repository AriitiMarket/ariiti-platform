"use client";

import React from "react";
import { Layers, Loader2 } from "lucide-react";

export interface SquadFormData {
  unitName: string;
  designation: string;
  specialization: string;
  overview: string;
  dispatchHubs: string;
  keyCompetencies: string;
  imageUrl: string;
  ctaText: string;
  ctaHref: string;
  order: number;
  isActive: boolean;
}

interface SquadModalProps {
  isOpen: boolean;
  isEditing: boolean;
  form: SquadFormData;
  error: string;
  isSubmitting: boolean;
  onChange: React.Dispatch<React.SetStateAction<SquadFormData>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SquadModal: React.FC<SquadModalProps> = ({
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
          <Layers className="w-5 h-5 text-brand-primary" />
          <span>{isEditing ? "Edit Technical Squad" : "Add Technical Squad"}</span>
        </h3>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-brand-primary mb-1">
              Unit Name *
            </label>
            <input
              type="text"
              required
              value={form.unitName}
              onChange={(e) => onChange((p) => ({ ...p, unitName: e.target.value }))}
              placeholder="e.g. Ariiti POS & Commerce Engineering Unit"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Designation / Subtitle *
              </label>
              <input
                type="text"
                required
                value={form.designation}
                onChange={(e) => onChange((p) => ({ ...p, designation: e.target.value }))}
                placeholder="e.g. Retail Systems & Peripheral Integration"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Specialization Tags *
              </label>
              <input
                type="text"
                required
                value={form.specialization}
                onChange={(e) => onChange((p) => ({ ...p, specialization: e.target.value }))}
                placeholder="e.g. Offline-First Sync, ESC/POS Protocols"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-brand-primary mb-1">
              Dispatch Hubs & Locations *
            </label>
            <input
              type="text"
              required
              value={form.dispatchHubs}
              onChange={(e) => onChange((p) => ({ ...p, dispatchHubs: e.target.value }))}
              placeholder="e.g. Stationed at Harar Hub & Dire Dawa Center"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block font-semibold text-brand-primary mb-1">
              Overview Description
            </label>
            <textarea
              rows={2}
              value={form.overview}
              onChange={(e) => onChange((p) => ({ ...p, overview: e.target.value }))}
              placeholder="Comprehensive description of the squad's scope and client benefits..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block font-semibold text-brand-primary mb-1">
              Core Technical Competencies * (one per line)
            </label>
            <textarea
              rows={3}
              required
              value={form.keyCompetencies}
              onChange={(e) => onChange((p) => ({ ...p, keyCompetencies: e.target.value }))}
              placeholder="Local-first indexed database architecture&#10;ESC/POS thermal printer firmware calibration&#10;Dual-screen customer display sync"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brand-primary mb-1">
                Card Image URL
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

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="squadActive"
              checked={form.isActive}
              onChange={(e) => onChange((p) => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="squadActive" className="font-semibold text-slate-700 cursor-pointer">
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
              <span>Save Squad</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
