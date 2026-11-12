import React from "react";
import connectDB from "@/lib/mongodb";
import TeamSquad from "@/models/TeamSquad";
import TeamMember from "@/models/TeamMember";
import TeamManager from "@/components/admin/TeamManager";
import { ensureDefaultTeamData } from "@/actions/admin/team";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  await connectDB();
  await ensureDefaultTeamData();

  const [rawSquads, rawMembers] = await Promise.all([
    TeamSquad.find().sort({ order: 1, createdAt: -1 }).lean(),
    TeamMember.find().sort({ order: 1, createdAt: -1 }).lean(),
  ]);

  const squads = rawSquads.map((s: any) => ({
    _id: s._id.toString(),
    unitName: s.unitName,
    designation: s.designation,
    specialization: s.specialization,
    overview: s.overview || "",
    dispatchHubs: s.dispatchHubs,
    keyCompetencies: s.keyCompetencies || [],
    imageUrl: s.imageUrl || "",
    ctaText: s.ctaText || "Inquire on Engineering",
    ctaHref: s.ctaHref || "/contact",
    order: s.order || 0,
    isActive: Boolean(s.isActive),
  }));

  const members = rawMembers.map((m: any) => ({
    _id: m._id.toString(),
    name: m.name,
    role: m.role,
    department: m.department,
    bio: m.bio,
    location: m.location,
    skills: m.skills || [],
    imageUrl: m.imageUrl || "",
    inquiryTopic: m.inquiryTopic || "Technical Consultation",
    inquiryHref: m.inquiryHref || "/contact",
    order: m.order || 0,
    isActive: Boolean(m.isActive),
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <TeamManager initialSquads={squads} initialMembers={members} />
    </div>
  );
}
