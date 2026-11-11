import { z } from "zod";

export const serviceCategoryEnum = z.enum([
  "SOFTWARE_DEVELOPMENT",
  "NETWORKING_INFRASTRUCTURE",
  "HARDWARE_EQUIPMENT",
  "IT_MAINTENANCE_SUPPORT",
]);

export const createServiceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(120, "Title cannot exceed 120 characters"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters long")
    .max(120, "Slug cannot exceed 120 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  category: serviceCategoryEnum,
  summary: z
    .string()
    .trim()
    .min(10, "Summary must be at least 10 characters long")
    .max(250, "Summary should be a punchy 1-2 sentences under 250 characters"),
  description: z
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters long"),
  problemsSolved: z
    .array(z.string().trim().min(3, "Pain point item must not be blank"))
    .min(1, "At least one business pain point must be specified"),
  targetCustomers: z
    .string()
    .trim()
    .min(5, "Target customer description must be at least 5 characters long"),
  whatsIncluded: z
    .array(z.string().trim().min(3, "Deliverable item must not be blank"))
    .min(1, "At least one deliverable item is required"),
  iconName: z.string().trim().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  // If whatsIncluded or problemsSolved are provided during update, enforce non-empty array
  whatsIncluded: z
    .array(z.string().trim().min(3, "Deliverable item must not be blank"))
    .min(1, "At least one deliverable item is required")
    .optional(),
  problemsSolved: z
    .array(z.string().trim().min(3, "Pain point item must not be blank"))
    .min(1, "At least one business pain point must be specified")
    .optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
