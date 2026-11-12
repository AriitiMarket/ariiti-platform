"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";

export async function upsertTestimonial(
  payload: {
    quote: string;
    clientType: string;
    clientName?: string;
    location: string;
    deploymentSummary: string;
    verifiedTag?: string;
    rating?: number;
    isPublished?: boolean;
    displayOrder?: number;
  },
  id?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot manage testimonials.",
    };
  }

  if (!payload.quote || !payload.clientType || !payload.location || !payload.deploymentSummary) {
    return { success: false, error: "Quote, client type, location, and deployment summary are required." };
  }

  try {
    await connectDB();

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid testimonial ID." };
      }

      const existing = await Testimonial.findById(id);
      if (!existing) {
        return { success: false, error: "Testimonial not found." };
      }

      Object.assign(existing, payload);
      await existing.save();

      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "UPDATE",
        entityType: "TESTIMONIAL",
        entityId: id,
        summary: `Updated testimonial for "${existing.clientType} (${existing.location})".`,
      });

      revalidatePath("/");
      revalidatePath("/admin/testimonials");

      return { success: true, id: existing._id.toString() };
    } else {
      const newTestimonial = await Testimonial.create({
        ...payload,
        verifiedTag: payload.verifiedTag || "Verified Commercial Deployment",
        rating: payload.rating || 5,
        isPublished: payload.isPublished ?? true,
        displayOrder: payload.displayOrder || 0,
      });

      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "CREATE",
        entityType: "TESTIMONIAL",
        entityId: newTestimonial._id.toString(),
        summary: `Created testimonial for "${newTestimonial.clientType} (${newTestimonial.location})".`,
      });

      revalidatePath("/");
      revalidatePath("/admin/testimonials");

      return { success: true, id: newTestimonial._id.toString() };
    }
  } catch (error: unknown) {
    console.error("[ERROR] upsertTestimonial failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save testimonial.",
    };
  }
}

export async function deleteTestimonial(testimonialId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot delete testimonials.",
    };
  }

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(testimonialId)) {
      return { success: false, error: "Invalid testimonial ID." };
    }

    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial) {
      return { success: false, error: "Testimonial not found." };
    }

    await Testimonial.findByIdAndDelete(testimonialId);

    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "staff@ariititech.com",
      action: "DELETE",
      entityType: "TESTIMONIAL",
      entityId: testimonialId,
      summary: `Deleted testimonial for "${testimonial.clientType}".`,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] deleteTestimonial failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete testimonial.",
    };
  }
}
