"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  MapPin,
  Loader2,
  ExternalLink,
  Layers,
  ArrowRight,
  Briefcase,
  Wrench,
} from "lucide-react";
import {
  upsertTeamSquad,
  deleteTeamSquad,
  toggleTeamSquadStatus,
  upsertTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
} from "@/actions/adminTeamActions";

export interface SquadItem {
  _id: string;
  unitName: string;
  designation: string;
  specialization: string;
  overview?: string;
  dispatchHubs: string;
  keyCompetencies: string[];
  imageUrl?: string;
  ctaText?: string;
  ctaHref?: string;
  order: number;
  isActive: boolean;
}

export interface MemberItem {
  _id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  location: string;
  skills: string[];
  imageUrl?: string;
  inquiryTopic?: string;
  inquiryHref?: string;
  order: number;
  isActive: boolean;
}

interface TeamManagerProps {
  initialSquads: SquadItem[];
  initialMembers: MemberItem[];
}

export const TeamManager: React.FC<TeamManagerProps> = ({
  initialSquads,
  initialMembers,
}) => {
  const [activeTab, setActiveTab] = useState<"squads" | "members">("squads");
  const [squads, setSquads] = useState<SquadItem[]>(initialSquads);
  const [members, setMembers] = useState<MemberItem[]>(initialMembers);

  // Squad Modal State
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [editingSquadId, setEditingSquadId] = useState<string | null>(null);
  const [isSquadSubmitting, setIsSquadSubmitting] = useState(false);
  const [squadError, setSquadError] = useState("");
  const [squadForm, setSquadForm] = useState({
    unitName: "",
    designation: "",
    specialization: "",
    overview: "",
    dispatchHubs: "",
    keyCompetencies: "",
    imageUrl: "",
    ctaText: "Inquire on Engineering",
    ctaHref: "/contact",
    order: 0,
    isActive: true,
  });

  // Member Modal State
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isMemberSubmitting, setIsMemberSubmitting] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [memberForm, setMemberForm] = useState({
    name: "",
    role: "",
    department: "",
    bio: "",
    location: "",
    skills: "",
    imageUrl: "",
    inquiryTopic: "Technical Consultation",
    inquiryHref: "/contact",
    order: 0,
    isActive: true,
  });

  // ----------------- SQUAD HANDLERS -----------------

  const openAddSquadModal = () => {
    setEditingSquadId(null);
    setSquadForm({
      unitName: "",
      designation: "",
      specialization: "",
      overview: "",
      dispatchHubs: "",
      keyCompetencies: "",
      imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
      ctaText: "Inquire on Engineering",
      ctaHref: "/contact",
      order: squads.length + 1,
      isActive: true,
    });
    setSquadError("");
    setIsSquadModalOpen(true);
  };

  const openEditSquadModal = (squad: SquadItem) => {
    setEditingSquadId(squad._id);
    setSquadForm({
      unitName: squad.unitName,
      designation: squad.designation,
      specialization: squad.specialization,
      overview: squad.overview || "",
      dispatchHubs: squad.dispatchHubs,
      keyCompetencies: squad.keyCompetencies.join("\n"),
      imageUrl: squad.imageUrl || "",
      ctaText: squad.ctaText || "Inquire on Engineering",
      ctaHref: squad.ctaHref || "/contact",
      order: squad.order,
      isActive: squad.isActive,
    });
    setSquadError("");
    setIsSquadModalOpen(true);
  };

  const handleSaveSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSquadSubmitting(true);
    setSquadError("");

    const payload = {
      ...squadForm,
      keyCompetencies: squadForm.keyCompetencies
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await upsertTeamSquad(payload, editingSquadId || undefined);
    setIsSquadSubmitting(false);

    if (res.success && res.squad) {
      if (editingSquadId) {
        setSquads((prev) =>
          prev.map((s) => (s._id === editingSquadId ? res.squad : s))
        );
      } else {
        setSquads((prev) => [...prev, res.squad]);
      }
      setIsSquadModalOpen(false);
    } else {
      setSquadError(res.error || "Failed to save technical squad.");
    }
  };

  const handleDeleteSquad = async (squad: SquadItem) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${squad.unitName}"?`
      )
    ) {
      return;
    }
    const res = await deleteTeamSquad(squad._id);
    if (res.success) {
      setSquads((prev) => prev.filter((s) => s._id !== squad._id));
    } else {
      alert(res.error || "Failed to delete squad.");
    }
  };

  const handleToggleSquadStatus = async (squad: SquadItem) => {
    const nextStatus = !squad.isActive;
    const res = await toggleTeamSquadStatus(squad._id, nextStatus);
    if (res.success) {
      setSquads((prev) =>
        prev.map((s) => (s._id === squad._id ? { ...s, isActive: nextStatus } : s))
      );
    } else {
      alert(res.error || "Failed to update status.");
    }
  };

  // ----------------- MEMBER HANDLERS -----------------

  const openAddMemberModal = () => {
    setEditingMemberId(null);
    setMemberForm({
      name: "",
      role: "",
      department: "",
      bio: "",
      location: "",
      skills: "",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      inquiryTopic: "Technical Consultation",
      inquiryHref: "/contact",
      order: members.length + 1,
      isActive: true,
    });
    setMemberError("");
    setIsMemberModalOpen(true);
  };

  const openEditMemberModal = (member: MemberItem) => {
    setEditingMemberId(member._id);
    setMemberForm({
      name: member.name,
      role: member.role,
      department: member.department,
      bio: member.bio,
      location: member.location,
      skills: member.skills.join(", "),
      imageUrl: member.imageUrl || "",
      inquiryTopic: member.inquiryTopic || "Technical Consultation",
      inquiryHref: member.inquiryHref || "/contact",
      order: member.order,
      isActive: member.isActive,
    });
    setMemberError("");
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMemberSubmitting(true);
    setMemberError("");

    const payload = {
      ...memberForm,
      skills: memberForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await upsertTeamMember(payload, editingMemberId || undefined);
    setIsMemberSubmitting(false);

    if (res.success && res.member) {
      if (editingMemberId) {
        setMembers((prev) =>
          prev.map((m) => (m._id === editingMemberId ? res.member : m))
        );
      } else {
        setMembers((prev) => [...prev, res.member]);
      }
      setIsMemberModalOpen(false);
    } else {
      setMemberError(res.error || "Failed to save team member.");
    }
  };

  const handleDeleteMember = async (member: MemberItem) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${member.name}"?`
      )
    ) {
      return;
    }
    const res = await deleteTeamMember(member._id);
    if (res.success) {
      setMembers((prev) => prev.filter((m) => m._id !== member._id));
    } else {
      alert(res.error || "Failed to delete member.");
    }
  };

  const handleToggleMemberStatus = async (member: MemberItem) => {
    const nextStatus = !member.isActive;
    const res = await toggleTeamMemberStatus(member._id, nextStatus);
    if (res.success) {
      setMembers((prev) =>
        prev.map((m) => (m._id === member._id ? { ...m, isActive: nextStatus } : m))
      );
    } else {
      alert(res.error || "Failed to update status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Public Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-brand-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
              Engineering Personnel & Technical Units
            </span>
          </div>
          <h1 className="text-2xl font-black text-brand-primary tracking-tight">
            Team & Technical Squads Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full dynamic control over resident engineering squads, field maintenance units, and leadership staff profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/team"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-brand-primary text-xs font-bold transition-all border border-slate-200 shadow-xs"
          >
            <span>View Public Team Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-primary" />
          </Link>

          {activeTab === "squads" ? (
            <button
              onClick={openAddSquadModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Technical Squad</span>
            </button>
          ) : (
            <button
              onClick={openAddMemberModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl w-fit shadow-xs">
        <button
          onClick={() => setActiveTab("squads")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "squads"
              ? "bg-brand-primary text-white shadow-xs"
              : "text-slate-600 hover:text-brand-primary hover:bg-slate-50"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Technical Squads & Units ({squads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "members"
              ? "bg-brand-primary text-white shadow-xs"
              : "text-slate-600 hover:text-brand-primary hover:bg-slate-50"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Staff & Personnel Profiles ({members.length})</span>
        </button>
      </div>

      {/* TAB 1: TECHNICAL SQUADS */}
      {activeTab === "squads" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {squads.length === 0 ? (
            <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              No technical squads created yet. Click "Add Technical Squad" to create one.
            </div>
          ) : (
            squads.map((squad) => (
              <div
                key={squad._id}
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
                        onClick={() => handleToggleSquadStatus(squad)}
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
                        onClick={() => openEditSquadModal(squad)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-brand-primary transition-colors border border-slate-200"
                        title="Edit squad"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteSquad(squad)}
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
            ))
          )}
        </div>
      )}

      {/* TAB 2: STAFF & LEADERSHIP PROFILES */}
      {activeTab === "members" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {members.length === 0 ? (
            <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              No team members added yet. Click "Add Team Member" to create one.
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member._id}
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
                        onClick={() => handleToggleMemberStatus(member)}
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
                        onClick={() => openEditMemberModal(member)}
                        className="p-1 rounded bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-xs"
                        title="Edit member"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleDeleteMember(member)}
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
            ))
          )}
        </div>
      )}

      {/* SQUAD MODAL */}
      {isSquadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-brand-primary tracking-tight mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-primary" />
              <span>{editingSquadId ? "Edit Technical Squad" : "Add Technical Squad"}</span>
            </h3>

            {squadError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                {squadError}
              </div>
            )}

            <form onSubmit={handleSaveSquad} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-primary mb-1">
                  Unit Name *
                </label>
                <input
                  type="text"
                  required
                  value={squadForm.unitName}
                  onChange={(e) => setSquadForm((p) => ({ ...p, unitName: e.target.value }))}
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
                    value={squadForm.designation}
                    onChange={(e) => setSquadForm((p) => ({ ...p, designation: e.target.value }))}
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
                    value={squadForm.specialization}
                    onChange={(e) => setSquadForm((p) => ({ ...p, specialization: e.target.value }))}
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
                  value={squadForm.dispatchHubs}
                  onChange={(e) => setSquadForm((p) => ({ ...p, dispatchHubs: e.target.value }))}
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
                  value={squadForm.overview}
                  onChange={(e) => setSquadForm((p) => ({ ...p, overview: e.target.value }))}
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
                  value={squadForm.keyCompetencies}
                  onChange={(e) => setSquadForm((p) => ({ ...p, keyCompetencies: e.target.value }))}
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
                    value={squadForm.imageUrl}
                    onChange={(e) => setSquadForm((p) => ({ ...p, imageUrl: e.target.value }))}
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
                    value={squadForm.order}
                    onChange={(e) => setSquadForm((p) => ({ ...p, order: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="squadActive"
                  checked={squadForm.isActive}
                  onChange={(e) => setSquadForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                />
                <label htmlFor="squadActive" className="font-semibold text-slate-700 cursor-pointer">
                  Active (Published on public website)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSquadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold transition-colors border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSquadSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isSquadSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Squad</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER MODAL */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-brand-primary tracking-tight mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-primary" />
              <span>{editingMemberId ? "Edit Team Member" : "Add Team Member"}</span>
            </h3>

            {memberError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                {memberError}
              </div>
            )}

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-primary mb-1">
                    Staff Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm((p) => ({ ...p, name: e.target.value }))}
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
                    value={memberForm.role}
                    onChange={(e) => setMemberForm((p) => ({ ...p, role: e.target.value }))}
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
                    value={memberForm.department}
                    onChange={(e) => setMemberForm((p) => ({ ...p, department: e.target.value }))}
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
                    value={memberForm.location}
                    onChange={(e) => setMemberForm((p) => ({ ...p, location: e.target.value }))}
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
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm((p) => ({ ...p, bio: e.target.value }))}
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
                  value={memberForm.skills}
                  onChange={(e) => setMemberForm((p) => ({ ...p, skills: e.target.value }))}
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
                    value={memberForm.imageUrl}
                    onChange={(e) => setMemberForm((p) => ({ ...p, imageUrl: e.target.value }))}
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
                    value={memberForm.order}
                    onChange={(e) => setMemberForm((p) => ({ ...p, order: Number(e.target.value) }))}
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
                    value={memberForm.inquiryTopic}
                    onChange={(e) => setMemberForm((p) => ({ ...p, inquiryTopic: e.target.value }))}
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
                    value={memberForm.inquiryHref}
                    onChange={(e) => setMemberForm((p) => ({ ...p, inquiryHref: e.target.value }))}
                    placeholder="/contact?category=SOFTWARE_DEVELOPMENT"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="memberActive"
                  checked={memberForm.isActive}
                  onChange={(e) => setMemberForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                />
                <label htmlFor="memberActive" className="font-semibold text-slate-700 cursor-pointer">
                  Active (Published on public website)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold transition-colors border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMemberSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isMemberSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
