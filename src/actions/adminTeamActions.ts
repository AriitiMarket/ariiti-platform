"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import TeamSquad from "@/models/TeamSquad";
import TeamMember from "@/models/TeamMember";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";

const DEFAULT_SQUADS = [
  {
    unitName: "Ariiti POS & Commerce Engineering Unit",
    designation: "Retail Systems & Peripheral Integration",
    specialization: "Offline-First Sync, ESC/POS Protocols, Touch Hardware",
    overview:
      "Specialized in deploying high-throughput point-of-sale infrastructure for supermarkets, pharmacies, and wholesale distribution centers across Harar and Dire Dawa. Guarantees 0ms local checkout latency even during complete internet blackouts.",
    dispatchHubs: "Stationed at Harar Hub & Dire Dawa Center",
    keyCompetencies: [
      "Local-first indexed database architecture",
      "ESC/POS thermal printer firmware calibration",
      "Dual-screen customer display sync",
      "Barcode scanner & electronic cash drawer triggers",
    ],
    imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80",
    ctaText: "Inquire on POS Deployment",
    ctaHref: "/contact?category=HARDWARE_EQUIPMENT",
    order: 1,
    isActive: true,
  },
  {
    unitName: "Structured Cabling & Rack Infrastructure Squad",
    designation: "Physical Layer Network Engineering",
    specialization: "Cat6/Fiber Backbones, 12U-42U Racks, Fluke Certification",
    overview:
      "Engineers certified structured copper backbones, organized 19-inch 12U/24U server rack deployments, and high-density UniFi access point arrays for commercial complexes, multi-floor hotels, and institutional campuses.",
    dispatchHubs: "Field Operations Unit 1 (Harar & Dire Dawa)",
    keyCompetencies: [
      "High-density patch panel termination & dressing",
      "Fluke channel link certification & attenuation testing",
      "Clean server rack layout with horizontal wire management",
      "VLAN network segmentation & MikroTik router configs",
    ],
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    ctaText: "Schedule Site Survey",
    ctaHref: "/contact?category=NETWORKING_INFRASTRUCTURE",
    order: 2,
    isActive: true,
  },
  {
    unitName: "Rapid Response IT Maintenance & Field Support",
    designation: "Enterprise SLA Incident Management",
    specialization: "2-Hour Regional Emergency Dispatch, Preventative Audits",
    overview:
      "Delivering dependable technical peace of mind. Provides rapid on-premise emergency response for critical system halts, automated verified daily database backups, and scheduled monthly hardware de-dusting.",
    dispatchHubs: "Mobile Incident Response Units stationed in Harar & Dire Dawa",
    keyCompetencies: [
      "Guaranteed 2-hour on-premise emergency arrival in core districts",
      "On-site spare hardware inventory (switches, PSUs, routers)",
      "Scheduled monthly preventive maintenance & dust cleaning",
      "Ethernet port testing and continuity verification",
    ],
    imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
    ctaText: "Request SLA Support Agreement",
    ctaHref: "/contact?category=IT_MAINTENANCE_SUPPORT",
    order: 3,
    isActive: true,
  },
  {
    unitName: "Cloud Systems & Business Automation Unit",
    designation: "Custom Software Architecture & Enterprise APIs",
    specialization: "Next.js, Node.js, Distributed DBs, Inventory Engines",
    overview:
      "Designs and builds custom enterprise web applications, inventory management systems, and automated branch synchronization systems engineered specifically for local Ethiopian connectivity realities.",
    dispatchHubs: "Software Development Laboratory (Harar)",
    keyCompetencies: [
      "Custom ERP, inventory, and supply chain applications",
      "Secure REST & GraphQL API integrations",
      "Multi-branch automated data synchronization",
      "Role-based access control (RBAC) & audit logging",
    ],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    ctaText: "Consult Software Team",
    ctaHref: "/contact?category=SOFTWARE_DEVELOPMENT",
    order: 4,
    isActive: true,
  },
];

const DEFAULT_MEMBERS = [
  {
    name: "Lead Systems Architect",
    role: "Head of Software Engineering & Offline POS",
    department: "Ariiti POS & Commerce Unit",
    bio: "Specializing in local-first browser databases (IndexedDB), distributed data synchronization, and hardware ESC/POS protocol integration for commercial retail operations.",
    location: "Harar Operations Center",
    skills: ["TypeScript", "Next.js App Router", "MongoDB", "IndexedDB", "Hardware APIs"],
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    inquiryTopic: "Software Architecture Consultation",
    inquiryHref: "/contact?category=SOFTWARE_DEVELOPMENT",
    order: 1,
    isActive: true,
  },
  {
    name: "Senior Network Engineer",
    role: "Lead Commercial Cabling & MikroTik Specialist",
    department: "Ariiti Network Infrastructure Unit",
    bio: "Over 8 years deploying Cat6 solid copper infrastructure, multi-floor server racks, MikroTik hardware VLAN routing, and high-density commercial Wi-Fi across Eastern Ethiopia.",
    location: "Dire Dawa Field Office",
    skills: ["Cat6/Cat6A Cabling", "MikroTik RouterOS", "UniFi Enterprise", "Dual-WAN Failover", "Fiber Splicing"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    inquiryTopic: "Commercial Network Survey",
    inquiryHref: "/contact?category=NETWORKING_INFRASTRUCTURE",
    order: 2,
    isActive: true,
  },
  {
    name: "Emergency SLA Dispatch Lead",
    role: "Field Maintenance & Technical Operations Coordinator",
    department: "Ariiti Service Desk & SLA Unit",
    bio: "Coordinating rapid on-premise technician dispatches, automated NAS/cloud backup verification, and proactive hardware maintenance contracts throughout Harar and Dire Dawa.",
    location: "Regional 24/7 SLA Hotline",
    skills: ["SLA Incident Management", "Hardware De-dusting", "NAS Backup Audits", "Rapid Troubleshooting"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    inquiryTopic: "Emergency SLA Support",
    inquiryHref: "/contact?category=IT_MAINTENANCE_SUPPORT",
    order: 3,
    isActive: true,
  },
];

export async function ensureDefaultTeamData() {
  await connectDB();
  const squadCount = await TeamSquad.countDocuments();
  if (squadCount === 0) {
    await TeamSquad.insertMany(DEFAULT_SQUADS);
  }

  const memberCount = await TeamMember.countDocuments();
  if (memberCount === 0) {
    await TeamMember.insertMany(DEFAULT_MEMBERS);
  }
}

// ----------------- TECHNICAL SQUADS CRUD -----------------

export async function upsertTeamSquad(payload: any, id?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }
  if (session.user.role === "OPERATIONS") {
    return { success: false, error: "Permission denied: Operations role cannot manage technical squads." };
  }

  try {
    await connectDB();

    const data = {
      unitName: String(payload.unitName || "").trim(),
      designation: String(payload.designation || "").trim(),
      specialization: String(payload.specialization || "").trim(),
      overview: String(payload.overview || "").trim(),
      dispatchHubs: String(payload.dispatchHubs || "").trim(),
      keyCompetencies: Array.isArray(payload.keyCompetencies)
        ? payload.keyCompetencies.map((c: string) => String(c).trim()).filter(Boolean)
        : typeof payload.keyCompetencies === "string"
        ? payload.keyCompetencies.split("\n").map((c: string) => c.trim()).filter(Boolean)
        : [],
      imageUrl: String(payload.imageUrl || "").trim() || "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
      ctaText: String(payload.ctaText || "Inquire on Engineering").trim(),
      ctaHref: String(payload.ctaHref || "/contact").trim(),
      order: Number(payload.order) || 0,
      isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
    };

    if (!data.unitName || !data.designation || !data.specialization || !data.dispatchHubs) {
      return { success: false, error: "Missing required squad fields." };
    }
    if (data.keyCompetencies.length === 0) {
      return { success: false, error: "At least one key competency is required." };
    }

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid squad ID." };
      }
      const updated = await TeamSquad.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!updated) {
        return { success: false, error: "Technical squad not found." };
      }

      await AuditLog.create({
        actorEmail: session.user.email || session.user.name || "admin",
        action: "UPDATE",
        entityType: "SERVICE",
        entityId: id,
        summary: `Updated technical squad "${data.unitName}"`,
      });

      revalidatePath("/admin/team");
      revalidatePath("/team");
      revalidatePath("/");
      return { success: true, squad: JSON.parse(JSON.stringify(updated)) };
    } else {
      const created = await TeamSquad.create(data);

      await AuditLog.create({
        actorEmail: session.user.email || session.user.name || "admin",
        action: "CREATE",
        entityType: "SERVICE",
        entityId: created._id.toString(),
        summary: `Created technical squad "${data.unitName}"`,
      });

      revalidatePath("/admin/team");
      revalidatePath("/team");
      revalidatePath("/");
      return { success: true, squad: JSON.parse(JSON.stringify(created)) };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to save technical squad." };
  }
}

export async function deleteTeamSquad(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }
  if (session.user.role === "OPERATIONS") {
    return { success: false, error: "Permission denied." };
  }

  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid ID." };
    }

    const deleted = await TeamSquad.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: "Squad not found." };
    }

    await AuditLog.create({
      actorEmail: session.user.email || session.user.name || "admin",
      action: "DELETE",
      entityType: "SERVICE",
      entityId: id,
      summary: `Deleted technical squad "${deleted.unitName}"`,
    });

    revalidatePath("/admin/team");
    revalidatePath("/team");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete technical squad." };
  }
}

export async function toggleTeamSquadStatus(id: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    await connectDB();
    const updated = await TeamSquad.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!updated) return { success: false, error: "Squad not found." };

    await AuditLog.create({
      actorEmail: session.user.email || session.user.name || "admin",
      action: "STATUS_CHANGE",
      entityType: "SERVICE",
      entityId: id,
      summary: `Toggled technical squad "${updated.unitName}" status to ${isActive ? "ACTIVE" : "INACTIVE"}`,
    });

    revalidatePath("/admin/team");
    revalidatePath("/team");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update squad status." };
  }
}

// ----------------- TEAM MEMBERS CRUD -----------------

export async function upsertTeamMember(payload: any, id?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }
  if (session.user.role === "OPERATIONS") {
    return { success: false, error: "Permission denied: Operations role cannot manage team members." };
  }

  try {
    await connectDB();

    const data = {
      name: String(payload.name || "").trim(),
      role: String(payload.role || "").trim(),
      department: String(payload.department || "").trim(),
      bio: String(payload.bio || "").trim(),
      location: String(payload.location || "").trim(),
      skills: Array.isArray(payload.skills)
        ? payload.skills.map((s: string) => String(s).trim()).filter(Boolean)
        : typeof payload.skills === "string"
        ? payload.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      imageUrl: String(payload.imageUrl || "").trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      inquiryTopic: String(payload.inquiryTopic || "Technical Consultation").trim(),
      inquiryHref: String(payload.inquiryHref || "/contact").trim(),
      order: Number(payload.order) || 0,
      isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
    };

    if (!data.name || !data.role || !data.department || !data.bio || !data.location) {
      return { success: false, error: "Missing required team member fields." };
    }
    if (data.skills.length === 0) {
      return { success: false, error: "At least one skill is required." };
    }

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid team member ID." };
      }
      const updated = await TeamMember.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!updated) {
        return { success: false, error: "Team member not found." };
      }

      await AuditLog.create({
        actorEmail: session.user.email || session.user.name || "admin",
        action: "UPDATE",
        entityType: "USER",
        entityId: id,
        summary: `Updated team member profile "${data.name}" (${data.role})`,
      });

      revalidatePath("/admin/team");
      revalidatePath("/team");
      revalidatePath("/");
      return { success: true, member: JSON.parse(JSON.stringify(updated)) };
    } else {
      const created = await TeamMember.create(data);

      await AuditLog.create({
        actorEmail: session.user.email || session.user.name || "admin",
        action: "CREATE",
        entityType: "USER",
        entityId: created._id.toString(),
        summary: `Created team member profile "${data.name}" (${data.role})`,
      });

      revalidatePath("/admin/team");
      revalidatePath("/team");
      revalidatePath("/");
      return { success: true, member: JSON.parse(JSON.stringify(created)) };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to save team member." };
  }
}

export async function deleteTeamMember(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }
  if (session.user.role === "OPERATIONS") {
    return { success: false, error: "Permission denied." };
  }

  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid ID." };
    }

    const deleted = await TeamMember.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: "Team member not found." };
    }

    await AuditLog.create({
      actorEmail: session.user.email || session.user.name || "admin",
      action: "DELETE",
      entityType: "USER",
      entityId: id,
      summary: `Deleted team member profile "${deleted.name}"`,
    });

    revalidatePath("/admin/team");
    revalidatePath("/team");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete team member." };
  }
}

export async function toggleTeamMemberStatus(id: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    await connectDB();
    const updated = await TeamMember.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!updated) return { success: false, error: "Team member not found." };

    await AuditLog.create({
      actorEmail: session.user.email || session.user.name || "admin",
      action: "STATUS_CHANGE",
      entityType: "USER",
      entityId: id,
      summary: `Toggled team member "${updated.name}" status to ${isActive ? "ACTIVE" : "INACTIVE"}`,
    });

    revalidatePath("/admin/team");
    revalidatePath("/team");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update member status." };
  }
}
