"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import CaseStudy from "@/models/CaseStudy";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";
import {
  createCaseStudySchema,
  updateCaseStudySchema,
} from "@/lib/validations/caseStudy";

export async function upsertCaseStudy(payload: unknown, id?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  // Content managers and Super admins can edit case studies
  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot author case studies.",
    };
  }

  try {
    await connectDB();

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid case study ID format." };
      }

      const parsed = updateCaseStudySchema.safeParse(payload);
      if (!parsed.success) {
        return {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        };
      }

      const existing = await CaseStudy.findById(id);
      if (!existing) {
        return { success: false, error: "Case study not found." };
      }

      Object.assign(existing, parsed.data);
      await existing.save();

      // Atomic Audit Log
      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "UPDATE",
        entityType: "CASE_STUDY",
        entityId: id,
        summary: `Updated case study "${existing.title}" (Status: ${existing.publicationStatus}).`,
      });

      // On-Demand ISR
      revalidatePath("/portfolio");
      revalidatePath(`/portfolio/${existing.slug}`);
      revalidatePath("/products");
      revalidatePath("/services");
      revalidatePath("/");
      revalidatePath("/admin/case-studies");

      return { success: true, id: existing._id.toString(), slug: existing.slug };
    } else {
      const parsed = createCaseStudySchema.safeParse(payload);
      if (!parsed.success) {
        return {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        };
      }

      // Check slug uniqueness
      const slugExists = await CaseStudy.findOne({ slug: parsed.data.slug });
      if (slugExists) {
        return {
          success: false,
          error: "A case study with this slug already exists. Please modify the slug.",
        };
      }

      const newCaseStudy = await CaseStudy.create(parsed.data);

      // Atomic Audit Log
      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "CREATE",
        entityType: "CASE_STUDY",
        entityId: newCaseStudy._id.toString(),
        summary: `Created new corporate case study "${newCaseStudy.title}".`,
      });

      // On-Demand ISR
      revalidatePath("/portfolio");
      revalidatePath(`/portfolio/${newCaseStudy.slug}`);
      revalidatePath("/products");
      revalidatePath("/services");
      revalidatePath("/");
      revalidatePath("/admin/case-studies");

      return {
        success: true,
        id: newCaseStudy._id.toString(),
        slug: newCaseStudy.slug,
      };
    }
  } catch (error: unknown) {
    console.error("[ERROR] upsertCaseStudy failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save case study.",
    };
  }
}

export async function deleteCaseStudy(caseStudyId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot delete case studies.",
    };
  }

  if (!mongoose.Types.ObjectId.isValid(caseStudyId)) {
    return { success: false, error: "Invalid case study ID format." };
  }

  try {
    await connectDB();

    const caseStudy = await CaseStudy.findByIdAndDelete(caseStudyId);
    if (!caseStudy) {
      return { success: false, error: "Case study not found." };
    }

    // Atomic Audit Log
    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "staff@ariititech.com",
      action: "DELETE",
      entityType: "CASE_STUDY",
      entityId: caseStudyId,
      summary: `Deleted case study "${caseStudy.title}".`,
    });

    // On-Demand ISR
    revalidatePath("/portfolio");
    revalidatePath("/products");
    revalidatePath("/services");
    revalidatePath("/");
    revalidatePath("/admin/case-studies");

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] deleteCaseStudy failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete case study.",
    };
  }
}
