import { z } from "zod";

/**
 * Regex accepting:
 * 1. Ethiopian format: +2519xxxxxxxx, +2517xxxxxxxx, 09xxxxxxxx, 07xxxxxxxx
 * 2. Standard E.164 international format: +[country code][number]
 */
export const phoneRegex =
  /^(\+251[97]\d{8}|0[97]\d{8}|\+[1-9]\d{1,14})$/;

export const inquiryCategoryEnum = z.enum([
  "SOFTWARE_DEVELOPMENT",
  "NETWORKING_INFRASTRUCTURE",
  "HARDWARE_EQUIPMENT",
  "IT_MAINTENANCE_SUPPORT",
  "PRODUCT_INQUIRY",
  "GENERAL",
]);

export const inquiryStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "RESOLVED",
  "SPAM",
]);

/**
 * Public Customer Inquiry Submission Schema
 */
export const createInquirySchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),
  businessName: z
    .string()
    .trim()
    .max(120, "Business name cannot exceed 120 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(
      phoneRegex,
      "Please enter a valid Ethiopian phone number (e.g. 0912345678 or +251912345678) or international format"
    ),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),
  serviceCategory: inquiryCategoryEnum,
  requestedServiceTitle: z
    .string()
    .trim()
    .min(2, "Service or product title is required")
    .max(120, "Service title cannot exceed 120 characters"),
  relatedServiceId: z.string().trim().optional().or(z.literal("")),
  relatedProductId: z.string().trim().optional().or(z.literal("")),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters long (e.g., Harar, Dire Dawa)")
    .max(100, "Location cannot exceed 100 characters"),
  projectDescription: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters describing your project or request")
    .max(3000, "Project description cannot exceed 3000 characters"),
  referralContext: z
    .object({
      sourcePage: z.string().trim().optional(),
      caseStudySlug: z.string().trim().optional(),
      productSlug: z.string().trim().optional(),
    })
    .optional(),
  // Honeypot field: Must remain empty. If filled, request is silently flagged/dropped as bot spam
  honeypot: z.string().max(0, "Bot submission detected").optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export const inquirySchema = createInquirySchema;
export type InquiryInput = CreateInquiryInput;

/**
 * Internal Admin Note Addition Schema
 */
export const addInquiryNoteSchema = z.object({
  note: z
    .string()
    .trim()
    .min(2, "Note cannot be empty")
    .max(1000, "Note cannot exceed 1000 characters"),
  authorName: z
    .string()
    .trim()
    .min(2, "Author name is required"),
});

export type AddInquiryNoteInput = z.infer<typeof addInquiryNoteSchema>;

/**
 * Admin Inquiry Status Update Schema
 */
export const updateInquiryStatusSchema = z.object({
  status: inquiryStatusEnum,
  assignedTo: z.string().trim().optional(),
});

export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
