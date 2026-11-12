"use client";

import React from "react";
import { CheckCircle2, EyeOff, Edit2, Trash2, MapPin } from "lucide-react";
import { SquadItem } from "./types";

interface SquadCardProps {
  squad: SquadItem;
  onToggleStatus: (squad: SquadItem) => void;
  onEdit: (squad: SquadItem) => void;
  onDelete: (squad: SquadItem) => void;
}

export const SquadCard: React.FC<SquadCardProps> = ({
  squad,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all ${
        squad.isActive ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-50/50"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-primary font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 truncate max-w-[200px]">
            {squad.designation}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleStatus(squad)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                squad.isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}
              title="Toggle Squad Visibility"
            >
              {squad.isActive ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Active</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 text-slate-400" />
                  <span>Hidden</span>
                </>
              )}
            </button>

            <button
              onClick={() => onEdit(squad)}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-brand-primary transition-colors border border-slate-200"
              title="Edit squad"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(squad)}
              className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border border-slate-200"
              title="Delete squad"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h2 className="text-base font-bold text-brand-primary mb-1">
          {squad.unitName}
        </h2>
        <p className="text-xs text-slate-600 mb-3 font-mono">
          {squad.specialization}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-slate-700 mb-4 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-primary" />
          <span className="truncate">{squad.dispatchHubs}</span>
        </div>

        {squad.overview && (
          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {squad.overview}
          </p>
        )}

        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
            Core Technical Competencies:
          </span>
          {squad.keyCompetencies.map((comp, cIdx) => (
            <div key={cIdx} className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
              <span>{comp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Order: #{squad.order}</span>
        <span>CTA: {squad.ctaText}</span>
      </div>
    </div>
  );
};
