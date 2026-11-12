"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import TeamSquad from "@/models/TeamSquad";
import TeamMember from "@/models/TeamMember";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";
import { DEFAULT_SQUADS, DEFAULT_MEMBERS } from "./teamDefaults";

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
