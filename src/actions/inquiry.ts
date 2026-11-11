"use server";

import connectDB from "@/lib/mongodb";
import Inquiry, { InquiryCategory, InquiryStatus } from "@/models/Inquiry";
import {
  createInquirySchema,
  CreateInquiryInput,
  updateInquiryStatusSchema,
  UpdateInquiryStatusInput,
  addInquiryNoteSchema,
  AddInquiryNoteInput,
} from "@/lib/validations/inquiry";
import { sendInquiryTelegramAlert } from "@/lib/telegram";
import { logAdminAction } from "@/lib/audit";
import mongoose from "mongoose";

export interface ServerActionResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Public action: Handles customer inquiry submissions from corporate landing and contact pages.
 * Incorporates honeypot bot trap, schema validation, DB persistence, and Telegram dispatch.
 */
export async function submitInquiry(
  rawInput: unknown
): Promise<ServerActionResult<{ id: string }>> {
  // Honeypot trap: Silently discard automated spam submissions before full validation
  if (
    typeof rawInput === "object" &&
    rawInput !== null &&
    "honeypot" in rawInput &&
    typeof (rawInput as any).honeypot === "string" &&
    (rawInput as any).honeypot.trim().length > 0
  ) {
    console.warn("[SECURITY] Bot inquiry trapped via honeypot field.");
    // Return friendly false-positive confirmation to deceive spam bots
    return {
      success: true,
      message: "Your inquiry has been received. Our team will contact you shortly.",
      data: { id: "simulated_spam_sink" },
    };
  }

  const parsed = createInquirySchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted form errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await connectDB();

    const createdInquiry = await Inquiry.create({
      customerName: data.customerName,
      businessName: data.businessName || undefined,
      phone: data.phone,
      email: data.email || undefined,
      serviceCategory: data.serviceCategory,
      requestedServiceTitle: data.requestedServiceTitle,
      relatedServiceId: data.relatedServiceId
        ? new mongoose.Types.ObjectId(data.relatedServiceId)
        : undefined,
      relatedProductId: data.relatedProductId
        ? new mongoose.Types.ObjectId(data.relatedProductId)
        : undefined,
      location: data.location,
      projectDescription: data.projectDescription,
      referralContext: data.referralContext,
      status: "NEW",
    });

    // Fire and forget Telegram notification to regional operations
    sendInquiryTelegramAlert(createdInquiry.toObject()).catch((err) =>
      console.error("[TELEGRAM BACKGROUND DISPATCH ERROR]", err)
    );

    return {
      success: true,
      message: "Thank you! An Ariiti Tech technical specialist will reach out within 2-4 business hours.",
      data: { id: createdInquiry._id.toString() },
    };
  } catch (error: any) {
    console.error("[INQUIRY SUBMISSION ERROR]", error);
    return {
      success: false,
      message: "An unexpected error occurred while processing your request. Please call or WhatsApp us directly.",
    };
  }
}

/**
 * Admin action: Query inquiries with filtering, search, and pagination.
 */
export async function getInquiries(params: {
  page?: number;
  limit?: number;
  status?: InquiryStatus;
  category?: InquiryCategory;
  search?: string;
} = {}): Promise<ServerActionResult<{ inquiries: any[]; total: number; page: number; totalPages: number }>> {
  try {
    await connectDB();

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 15));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (params.status) {
      query.status = params.status;
    }

    if (params.category) {
      query.serviceCategory = params.category;
    }

    if (params.search) {
      const searchRegex = new RegExp(params.search.trim(), "i");
      query.$or = [
        { customerName: searchRegex },
        { businessName: searchRegex },
        { phone: searchRegex },
        { location: searchRegex },
        { requestedServiceTitle: searchRegex },
      ];
    }

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .sort({ status: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        inquiries: JSON.parse(JSON.stringify(inquiries)),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error("[GET INQUIRIES ERROR]", error);
    return {
      success: false,
      message: "Failed to retrieve inquiries.",
    };
  }
}

/**
 * Admin action: Update status and assigned staff for an inquiry.
 */
export async function updateInquiryStatus(
  id: string,
  rawInput: UpdateInquiryStatusInput,
  adminUser?: { id: string; email: string }
): Promise<ServerActionResult> {
  const parsed = updateInquiryStatusSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid status update payload.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    const updateData: Record<string, any> = {
      status: parsed.data.status,
    };

    if (parsed.data.assignedTo) {
      updateData.assignedTo = new mongoose.Types.ObjectId(parsed.data.assignedTo);
    }

    const updated = await Inquiry.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (!updated) {
      return { success: false, message: "Inquiry not found." };
    }

    if (adminUser) {
      await logAdminAction({
        actorId: adminUser.id,
        actorEmail: adminUser.email,
        action: "STATUS_CHANGE",
        entityType: "INQUIRY",
        entityId: id,
        summary: `Changed inquiry status to ${parsed.data.status}`,
      });
    }

    return {
      success: true,
      message: `Inquiry status updated to ${parsed.data.status}.`,
      data: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error: any) {
    console.error("[UPDATE INQUIRY STATUS ERROR]", error);
    return { success: false, message: "Failed to update inquiry status." };
  }
}

/**
 * Admin action: Add an internal note to an inquiry.
 */
export async function addInquiryNote(
  id: string,
  rawInput: AddInquiryNoteInput,
  adminUser?: { id: string; email: string }
): Promise<ServerActionResult> {
  const parsed = addInquiryNoteSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid note payload.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    const newNote = {
      note: parsed.data.note,
      authorName: parsed.data.authorName,
      createdAt: new Date(),
    };

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { $push: { internalNotes: newNote } },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Inquiry not found." };
    }

    if (adminUser) {
      await logAdminAction({
        actorId: adminUser.id,
        actorEmail: adminUser.email,
        action: "UPDATE",
        entityType: "INQUIRY",
        entityId: id,
        summary: `Added internal note to inquiry: ${parsed.data.note.substring(0, 50)}...`,
      });
    }

    return {
      success: true,
      message: "Internal note added successfully.",
      data: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error: any) {
    console.error("[ADD INQUIRY NOTE ERROR]", error);
    return { success: false, message: "Failed to record internal note." };
  }
}
