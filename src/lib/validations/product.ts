import { z } from "zod";

export const productStatusEnum = z.enum([
  "IN_DEVELOPMENT",
  "TESTING",
  "AVAILABLE",
  "TEMPORARILY_UNAVAILABLE",
]);

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters long")
    .max(100, "Product name cannot exceed 100 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters long")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  tagline: z
    .string()
    .trim()
    .min(5, "Tagline must be at least 5 characters long")
    .max(160, "Tagline cannot exceed 160 characters"),
  description: z
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters long"),
  targetCustomers: z
    .string()
    .trim()
    .min(5, "Target customer description must be at least 5 characters long"),
  mainFeatures: z
    .array(z.string().trim().min(3, "Feature description cannot be blank"))
    .min(1, "At least one key feature is required"),
  status: productStatusEnum.default("IN_DEVELOPMENT"),
  accessOrDemoUrl: z
    .string()
    .trim()
    .url("Must be a valid URL (e.g., https://demo.ariiti.com)")
    .optional()
    .or(z.literal("")),
  logoUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  screenshots: z
    .array(z.string().trim().url("Screenshot must be a valid URL"))
    .default([]),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
});

export const updateProductSchema = createProductSchema.partial().extend({
  mainFeatures: z
    .array(z.string().trim().min(3, "Feature description cannot be blank"))
    .min(1, "At least one key feature is required")
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
