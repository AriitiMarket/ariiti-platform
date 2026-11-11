"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import WebsiteSettings from "@/models/WebsiteSettings";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";

export interface UpdateSettingsInput {
  companyName: string;
  tagline: string;
  primaryPhone: string;
  secondaryPhone?: string;
  whatsappNumber: string;
  businessEmail: string;
  officeLocations: string[];
  socialLinks: {
    telegram?: string;
    linkedin?: string;
    facebook?: string;
    github?: string;
  };
  announcementBanner: {
    isActive: boolean;
    text: string;
    linkUrl?: string;
  };
}

export async function updateWebsiteSettings(payload: UpdateSettingsInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  // Settings are exclusively restricted to SUPER_ADMIN
  if (session.user.role !== "SUPER_ADMIN") {
    return {
      success: false,
      error: "Permission denied: Only SUPER_ADMIN can modify global website settings.",
    };
  }

  try {
    await connectDB();

    const existing = await WebsiteSettings.findOne();
    if (!existing) {
      await WebsiteSettings.create(payload);
    } else {
      Object.assign(existing, payload);
      await existing.save();
    }

    // Atomic Audit Log
    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "staff@ariititech.com",
      action: "UPDATE",
      entityType: "SETTINGS",
      entityId: existing ? existing._id.toString() : "GLOBAL_SETTINGS",
      summary: `Updated global platform settings (Phones, WhatsApp, Offices, Announcement Banner).`,
    });

    // Revalidate All Public & Admin Pages
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/products");
    revalidatePath("/portfolio");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] updateWebsiteSettings failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update website settings.",
    };
  }
}
