"use client";

import React, { useState, useTransition } from "react";
import { MessageSquare, Plus, X, Loader2, CheckCircle2 } from "lucide-react";
import { addInquiryNote } from "@/actions/adminInquiryActions";

interface AddNoteModalProps {
  inquiryId: string;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({ inquiryId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setError(null);
    startTransition(async () => {
      const res = await addInquiryNote(inquiryId, noteText);
      if (!res.success) {
        setError(res.error || "Failed to add note.");
      } else {
        setNoteText("");
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ariiti-accent hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Internal Note</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-left animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-note-title"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-ariiti-accent" />
                <h3 id="add-note-title" className="text-sm font-bold text-slate-100">
                  Add Operations Note
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="my-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Internal Operations / Engineering Observation
                </label>
                <textarea
                  required
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record call summary, client budget estimate, site survey scheduling, or assigned field technician..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ariiti-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !noteText.trim()}
                  className="px-4 py-2 rounded-xl bg-ariiti-accent hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Note...</span>
                    </>
                  ) : (
                    <span>Save to Internal Timeline</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNoteModal;
