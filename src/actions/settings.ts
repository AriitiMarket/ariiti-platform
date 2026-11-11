"use server";

import connectDB from "@/lib/mongodb";
import WebsiteSettings, { IWebsiteSettings } from "@/models/WebsiteSettings";
import { logAdminAction } from "@/lib/audit";
import { ServerActionResult } from "./inquiry";

/**
 * Public action: Get global corporate website settings.
 */
export async function getWebsiteSettings(): Promise<
  ServerActionResult<IWebsiteSettings | null>
> {
  try {
    await connectDB();

    const settings = await WebsiteSettings.findOne().lean();

    return {
      success: true,
      data: settings ? JSON.parse(JSON.stringify(settings)) : null,
    };
  } catch (error: any) {
    console.error("[GET WEBSITE SETTINGS ERROR]", error);
    return {
      success: false,
      message: "Failed to retrieve corporate settings.",
    };
  }
}

/**
 * Admin action: Update global corporate website settings.
 */
export async function updateWebsiteSettings(
  input: Partial<IWebsiteSettings>,
  adminUser?: { id: string; email: string }
): Promise<ServerActionResult> {
  try {
    await connectDB();

    const updated = await WebsiteSettings.findOneAndUpdate(
      {},
      { $set: input },
      { new: true, upsert: true }
    );

    if (adminUser) {
      await logAdminAction({
        actorId: adminUser.id,
        actorEmail: adminUser.email,
        action: "UPDATE",
        entityType: "SETTINGS",
        entityId: updated._id.toString(),
        summary: "Updated global corporate website settings and contact channels.",
      });
    }

    return {
      success: true,
      message: "Website settings updated successfully.",
      data: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error: any) {
    console.error("[UPDATE WEBSITE SETTINGS ERROR]", error);
    return {
      success: false,
      message: "Failed to update corporate settings.",
    };
  }
}
