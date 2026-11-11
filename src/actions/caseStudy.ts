"use server";

import connectDB from "@/lib/mongodb";
import CaseStudy, {
  ICaseStudy,
  ProjectType,
} from "@/models/CaseStudy";
import { ServiceCategory } from "@/models/Service";
import {
  createCaseStudySchema,
  updateCaseStudySchema,
} from "@/lib/validations/caseStudy";
import { logAdminAction } from "@/lib/audit";
import { ServerActionResult } from "./inquiry";

/**
 * Public sanitizer: Respects NDA client confidentiality.
 * If isClientConfidential is true, clientName is masked as "Confidential [clientSector] Client".
 */
function sanitizePublicCaseStudy(doc: any): any {
  if (!doc) return doc;
  const copy = { ...doc };
  if (copy.isClientConfidential) {
    copy.clientName = `Confidential ${copy.clientSector} Client`;
  }
  return copy;
}

/**
 * Public action: Get published corporate case studies.
 */
export async function getPublishedCaseStudies(params: {
  category?: ServiceCategory;
  projectType?: ProjectType;
  featuredOnly?: boolean;
} = {}): Promise<ServerActionResult<ICaseStudy[]>> {
  try {
    await connectDB();

    const query: Record<string, any> = { publicationStatus: "PUBLISHED" };

    if (params.category) query.category = params.category;
    if (params.projectType) query.projectType = params.projectType;
    if (params.featuredOnly) query.isFeatured = true;

    const caseStudies = await CaseStudy.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    const sanitized = caseStudies.map(sanitizePublicCaseStudy);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(sanitized)),
    };
  } catch (error: any) {
    console.error("[GET CASE STUDIES ERROR]", error);
    return { success: false, message: "Failed to fetch corporate case studies." };
  }
}

/**
 * Public action: Get single case study by slug.
 */
export async function getCaseStudyBySlug(
  slug: string
): Promise<ServerActionResult<ICaseStudy | null>> {
  try {
    await connectDB();

    const doc = await CaseStudy.findOne({
      slug: slug.toLowerCase().trim(),
      publicationStatus: "PUBLISHED",
    }).lean();

    if (!doc) {
      return { success: false, message: "Case study not found." };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(sanitizePublicCaseStudy(doc))),
    };
  } catch (error: any) {
    console.error("[GET CASE STUDY BY SLUG ERROR]", error);
    return { success: false, message: "Failed to retrieve case study." };
  }
}

/**
 * Admin action: Create a new corporate case study.
 */
export async function createCaseStudy(
  rawInput: unknown,
  adminUser?: { id: string; email: string }
): Promise<ServerActionResult> {
  const parsed = createCaseStudySchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed for case study creation.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    const exists = await CaseStudy.findOne({ slug: parsed.data.slug });
    if (exists) {
      return {
        success: false,
        message: "A case study with this URL slug already exists.",
      };
    }

    const created = await CaseStudy.create(parsed.data);

    if (adminUser) {
      await logAdminAction({
        actorId: adminUser.id,
        actorEmail: adminUser.email,
        action: "CREATE",
        entityType: "CASE_STUDY",
        entityId: created._id.toString(),
        summary: `Created case study: ${created.title}`,
      });
    }

    return {
      success: true,
      message: "Case study created successfully.",
      data: JSON.parse(JSON.stringify(created)),
    };
  } catch (error: any) {
    console.error("[CREATE CASE STUDY ERROR]", error);
    return { success: false, message: "Failed to create case study." };
  }
}

/**
 * Admin action: Update an existing case study.
 */
export async function updateCaseStudy(
  id: string,
  rawInput: unknown,
  adminUser?: { id: string; email: string }
): Promise<ServerActionResult> {
  const parsed = updateCaseStudySchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed for case study update.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    if (parsed.data.slug) {
      const conflict = await CaseStudy.findOne({
        slug: parsed.data.slug,
        _id: { $ne: id },
      });
      if (conflict) {
        return {
          success: false,
          message: "Another case study already uses this URL slug.",
        };
      }
    }

    const updated = await CaseStudy.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Case study not found." };
    }

    if (adminUser) {
      await logAdminAction({
        actorId: adminUser.id,
        actorEmail: adminUser.email,
        action: "UPDATE",
        entityType: "CASE_STUDY",
        entityId: id,
        summary: `Updated case study: ${updated.title}`,
      });
    }

    return {
      success: true,
      message: "Case study updated successfully.",
      data: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error: any) {
    console.error("[UPDATE CASE STUDY ERROR]", error);
    return { success: false, message: "Failed to update case study." };
  }
}
