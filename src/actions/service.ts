"use server";

import connectDB from "@/lib/mongodb";
import Service, { ServiceCategory, IService } from "@/models/Service";
import {
  createServiceSchema,
  updateServiceSchema,
} from "@/lib/validations/service";
import { logAdminAction } from "@/lib/audit";
import { ServerActionResult } from "./inquiry";

/**
 * Public action: Get list of active services ordered by displayOrder.
 */
export async function getActiveServices(
  category?: ServiceCategory
): Promise<ServerActionResult<IService[]>> {
  try {
    await connectDB();

    const query: Record<string, any> = { isActive: true };
    if (category) {
      query.category = category;
    }

    const services = await Service.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(services)),
    };
  } catch (error: any) {
    console.error("[GET ACTIVE SERVICES ERROR]", error);
    return { success: false, message: "Failed to fetch corporate services." };
  }
}

/**
 * Public action: Get a single service by slug.
 */
export async function getServiceBySlug(
  slug: string
): Promise<ServerActionResult<IService | null>> {
  try {
    await connectDB();

    const service = await Service.findOne({
      slug: slug.toLowerCase().trim(),
      isActive: true,
    }).lean();

    if (!service) {
      return { success: false, message: "Service not found." };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(service)),
    };
  } catch (error: any) {
    console.error("[GET SERVICE BY SLUG ERROR]", error);
    return { success: false, message: "Failed to retrieve service details." };
  }
}

/**
 * Admin action: Create a new service.
 */
export async function createService(
  rawInput: unknown,
  adminUser?: { id: string; email: string }
): Promise<ServerActionResult> {
  const parsed = createServiceSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed for service creation.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    const existingSlug = await Service.findOne({ slug: parsed.data.slug });
    if (existingSlug) {
      return {
        success: false,
        message: "A service with this URL slug already exists. Please pick a distinct slug.",
      };
    }

    const created = await Service.create(parsed.data);

    if (adminUser) {
      await logAdminAction({
        actorId: adminUser.id,
        actorEmail: adminUser.email,
        action: "CREATE",
        entityType: "SERVICE",
        entityId: created._id.toString(),
        summary: `Created new service: ${created.title} (${created.category})`,
      });
    }

    return {
      success: true,
      message: "Service created successfully.",
      data: JSON.parse(JSON.stringify(created)),
    };
  } catch (error: any) {
    console.error("[CREATE SERVICE ERROR]", error);
    return { success: false, message: "Failed to create service." };
  }
}

/**
 * Admin action: Update an existing service.
 */
export async function updateService(
  id: string,
  rawInput: unknown,
  adminUser?: { id: string; email: string }
): Promise<ServerActionResult> {
  const parsed = updateServiceSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed for service update.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    if (parsed.data.slug) {
      const conflict = await Service.findOne({
        slug: parsed.data.slug,
        _id: { $ne: id },
      });
      if (conflict) {
        return {
          success: false,
          message: "Another service already uses this URL slug.",
        };
      }
    }

    const updated = await Service.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Service not found." };
    }

    if (adminUser) {
      await logAdminAction({
        actorId: adminUser.id,
        actorEmail: adminUser.email,
        action: "UPDATE",
        entityType: "SERVICE",
        entityId: id,
        summary: `Updated service: ${updated.title}`,
      });
    }

    return {
      success: true,
      message: "Service updated successfully.",
      data: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error: any) {
    console.error("[UPDATE SERVICE ERROR]", error);
    return { success: false, message: "Failed to update service." };
  }
}

/**
 * Admin action: Soft-delete or toggle service status.
 */
export async function toggleServiceStatus(
  id: string,
  isActive: boolean,
  adminUser?: { id: string; email: string }
): Promise<ServerActionResult> {
  try {
    await connectDB();

    const updated = await Service.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Service not found." };
    }

    if (adminUser) {
      await logAdminAction({
        actorId: adminUser.id,
        actorEmail: adminUser.email,
        action: "STATUS_CHANGE",
        entityType: "SERVICE",
        entityId: id,
        summary: `${isActive ? "Activated" : "Deactivated"} service: ${updated.title}`,
      });
    }

    return {
      success: true,
      message: `Service ${isActive ? "activated" : "deactivated"} successfully.`,
      data: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error: any) {
    console.error("[TOGGLE SERVICE STATUS ERROR]", error);
    return { success: false, message: "Failed to modify service state." };
  }
}
