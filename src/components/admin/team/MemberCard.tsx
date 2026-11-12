"use client";

import React from "react";
import Image from "next/image";
import { Users, Edit2, Trash2, MapPin } from "lucide-react";
import { MemberItem } from "./types";

interface MemberCardProps {
  member: MemberItem;
  onToggleStatus: (member: MemberItem) => void;
  onEdit: (member: MemberItem) => void;
  onDelete: (member: MemberItem) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`flex flex-col bg-white rounded-2xl border shadow-xs overflow-hidden text-left transition-all justify-between ${
        member.isActive ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-50/50"
      }`}
    >
      <div>
        {/* Photo Banner */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
              <Users className="w-12 h-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
            <button
              onClick={() => onToggleStatus(member)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-xs ${
                member.isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-white text-slate-500 border border-slate-200"
              }`}
              title="Toggle Member Visibility"
            >
              {member.isActive ? "Active" : "Hidden"}
            </button>

            <button
              onClick={() => onEdit(member)}
              className="p-1 rounded bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-xs"
              title="Edit member"
            >
              <Edit2 className="w-3 h-3" />
            </button>

            <button
              onClick={() => onDelete(member)}
              className="p-1 rounded bg-white/90 hover:bg-rose-50 text-rose-600 border border-slate-200 shadow-xs"
              title="Delete member"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>

          <div className="absolute bottom-2.5 left-3 right-3 text-white">
            <span className="text-[10px] font-mono font-bold uppercase bg-brand-primary text-white px-2 py-0.5 rounded">
              {member.department}
            </span>
            <h3 className="text-base font-bold text-white mt-1 leading-tight">
              {member.name}
            </h3>
            <p className="text-[11px] text-slate-300">{member.role}</p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span className="truncate">{member.location}</span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {member.bio}
          </p>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold mb-1">
              Skills / Tech:
            </span>
            <div className="flex flex-wrap gap-1">
              {member.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Order: #{member.order}</span>
        <span className="truncate max-w-[150px]">{member.inquiryTopic}</span>
      </div>
    </div>
  );
};
