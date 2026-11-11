import { z } from "zod";
import { serviceCategoryEnum } from "./service";

export const projectTypeEnum = z.enum([
  "CLIENT_DEPLOYMENT",
  "INTERNAL_ECOSYSTEM_PRODUCT",
  "TECHNICAL_DEMONSTRATION",
]);

export const projectStatusEnum = z.enum([
  "COMPLETED",
  "ONGOING_SUPPORT",
  "PILOT_STAGE",
]);

export const publicationStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export const createCaseStudySchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(150, "Title cannot exceed 150 characters"),
  slug: z
    .string()
    .trim()
    .min(5, "Slug must be at least 5 characters long")
    .max(150, "Slug cannot exceed 150 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  category: serviceCategoryEnum,
  projectType: projectTypeEnum,
  clientSector: z
    .string()
    .trim()
    .min(3, "Client sector is required (e.g., Hospitality, Retail & Wholesale)"),
  clientName: z
    .string()
    .trim()
    .max(120, "Client name cannot exceed 120 characters")
    .optional()
    .or(z.literal("")),
  isClientConfidential: z.boolean().default(true),
  location: z
    .string()
    .trim()
    .min(2, "Location is required (e.g., Harar, Dire Dawa)"),
  summary: z
    .string()
    .trim()
    .min(20, "Summary must be at least 20 characters long")
    .max(300, "Summary should be under 300 characters"),
  problemAddressed: z
    .string()
    .trim()
    .min(50, "Problem description must be at least 50 characters long"),
  solutionImplemented: z
    .string()
    .trim()
    .min(50, "Solution description must be at least 50 characters long"),
  technologiesAndEquipment: z
    .array(z.string().trim().min(2, "Technology/equipment name cannot be blank"))
    .min(1, "At least one technology or hardware component is required"),
  measurableOutcomes: z
    .array(z.string().trim().min(3, "Outcome metric cannot be blank"))
    .default([]),
  coverImageUrl: z
    .string()
    .trim()
    .url("Cover image must be a valid URL"),
  galleryImageUrls: z
    .array(z.string().trim().url("Gallery image must be a valid URL"))
    .default([]),
  liveOrDemoUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  projectStatus: projectStatusEnum.default("COMPLETED"),
  publicationStatus: publicationStatusEnum.default("DRAFT"),
  isFeatured: z.boolean().default(false),
  completedAt: z.coerce.date().optional(),
  displayOrder: z.coerce.number().int().default(0),
});

export const updateCaseStudySchema = createCaseStudySchema.partial().extend({
  technologiesAndEquipment: z
    .array(z.string().trim().min(2, "Technology/equipment name cannot be blank"))
    .min(1, "At least one technology or hardware component is required")
    .optional(),
});

export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>;
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>;
