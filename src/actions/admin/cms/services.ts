"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";
import {
  createServiceSchema,
  updateServiceSchema,
} from "@/lib/validations/service";

export async function upsertService(payload: unknown, id?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot author services.",
    };
  }

  try {
    await connectDB();

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid service ID format." };
      }

      const parsed = updateServiceSchema.safeParse(payload);
      if (!parsed.success) {
        return {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        };
      }

      const existing = await Service.findById(id);
      if (!existing) {
        return { success: false, error: "Service not found." };
      }

      Object.assign(existing, parsed.data);
      await existing.save();

      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "UPDATE",
        entityType: "SERVICE",
        entityId: id,
        summary: `Updated service "${existing.title}".`,
      });

      revalidatePath("/services");
      revalidatePath(`/services/${existing.slug}`);
      revalidatePath("/");
      revalidatePath("/admin/services");

      return { success: true, id: existing._id.toString() };
    } else {
      const parsed = createServiceSchema.safeParse(payload);
      if (!parsed.success) {
        return {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        };
      }

      const slugExists = await Service.findOne({ slug: parsed.data.slug });
      if (slugExists) {
        return {
          success: false,
          error: "A service with this slug already exists.",
        };
      }

      const newService = await Service.create(parsed.data);

      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "CREATE",
        entityType: "SERVICE",
        entityId: newService._id.toString(),
        summary: `Created new service "${newService.title}".`,
      });

      revalidatePath("/services");
      revalidatePath("/");
      revalidatePath("/admin/services");

      return { success: true, id: newService._id.toString() };
    }
  } catch (error: unknown) {
    console.error("[ERROR] upsertService failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save service.",
    };
  }
}

export async function deleteService(serviceId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot delete services.",
    };
  }

  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    return { success: false, error: "Invalid service ID format." };
  }

  try {
    await connectDB();
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) {
      return { success: false, error: "Service not found." };
    }

    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "staff@ariititech.com",
      action: "DELETE",
      entityType: "SERVICE",
      entityId: serviceId,
      summary: `Deleted service "${service.title}".`,
    });

    revalidatePath("/services");
    revalidatePath("/");
    revalidatePath("/admin/services");

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] deleteService failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete service.",
    };
  }
}
