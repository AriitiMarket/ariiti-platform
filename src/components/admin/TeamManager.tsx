"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  ExternalLink,
  Layers,
  Briefcase,
} from "lucide-react";
import {
  upsertTeamSquad,
  deleteTeamSquad,
  toggleTeamSquadStatus,
  upsertTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
} from "@/actions/admin/team";
import { SquadItem, MemberItem } from "./team/types";
import { SquadCard } from "./team/SquadCard";
import { MemberCard } from "./team/MemberCard";
import { SquadModal, SquadFormData } from "./team/SquadModal";
import { MemberModal, MemberFormData } from "./team/MemberModal";

export type { SquadItem, MemberItem };

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
  const [squadForm, setSquadForm] = useState<SquadFormData>({
    unitName: "",
    designation: "",
    specialization: "",
    overview: "",
    dispatchHubs: "",
    keyCompetencies: "",
    imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
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
  const [memberForm, setMemberForm] = useState<MemberFormData>({
    name: "",
    role: "",
    department: "",
    bio: "",
    location: "",
    skills: "",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
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
    if (!window.confirm(`Are you sure you want to permanently delete "${squad.unitName}"?`)) {
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
    if (!window.confirm(`Are you sure you want to permanently delete "${member.name}"?`)) {
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
              <SquadCard
                key={squad._id}
                squad={squad}
                onToggleStatus={handleToggleSquadStatus}
                onEdit={openEditSquadModal}
                onDelete={handleDeleteSquad}
              />
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
              <MemberCard
                key={member._id}
                member={member}
                onToggleStatus={handleToggleMemberStatus}
                onEdit={openEditMemberModal}
                onDelete={handleDeleteMember}
              />
            ))
          )}
        </div>
      )}

      {/* SQUAD MODAL */}
      <SquadModal
        isOpen={isSquadModalOpen}
        isEditing={Boolean(editingSquadId)}
        form={squadForm}
        error={squadError}
        isSubmitting={isSquadSubmitting}
        onChange={setSquadForm}
        onClose={() => setIsSquadModalOpen(false)}
        onSubmit={handleSaveSquad}
      />

      {/* MEMBER MODAL */}
      <MemberModal
        isOpen={isMemberModalOpen}
        isEditing={Boolean(editingMemberId)}
        form={memberForm}
        error={memberError}
        isSubmitting={isMemberSubmitting}
        onChange={setMemberForm}
        onClose={() => setIsMemberModalOpen(false)}
        onSubmit={handleSaveMember}
      />
    </div>
  );
};

export default TeamManager;
