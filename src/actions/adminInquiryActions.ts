"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Inquiry, { InquiryStatus } from "@/models/Inquiry";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";

const VALID_STATUSES: InquiryStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "IN_PROGRESS",
  "CLOSED",
  "RESOLVED",
  "SPAM",
];

export async function updateInquiryStatus(inquiryId: string, newStatus: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (!VALID_STATUSES.includes(newStatus as InquiryStatus)) {
    return { success: false, error: `Invalid status: ${newStatus}` };
  }

  if (!mongoose.Types.ObjectId.isValid(inquiryId)) {
    return { success: false, error: "Invalid inquiry ID format." };
  }

  try {
    await connectDB();

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return { success: false, error: "Inquiry document not found." };
    }

    const previousStatus = inquiry.status;
    inquiry.status = newStatus as InquiryStatus;
    await inquiry.save();

    // Atomic Audit Log
    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "unknown@ariititech.com",
      action: "STATUS_CHANGE",
      entityType: "INQUIRY",
      entityId: inquiryId,
      summary: `Updated inquiry from [${previousStatus}] to [${newStatus}] for client "${inquiry.customerName}".`,
    });

    // Revalidate Admin Workspaces
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${inquiryId}`);

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] updateInquiryStatus failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update inquiry status.",
    };
  }
}

export async function addInquiryNote(inquiryId: string, noteText: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  const cleanNote = noteText.trim();
  if (!cleanNote) {
    return { success: false, error: "Note text cannot be empty." };
  }

  if (!mongoose.Types.ObjectId.isValid(inquiryId)) {
    return { success: false, error: "Invalid inquiry ID format." };
  }

  try {
    await connectDB();

    const authorName = session.user.name || session.user.email || "Ariiti Staff";

    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      {
        $push: {
          internalNotes: {
            note: cleanNote,
            authorName,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!inquiry) {
      return { success: false, error: "Inquiry document not found." };
    }

    // Atomic Audit Log
    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "unknown@ariititech.com",
      action: "UPDATE",
      entityType: "INQUIRY",
      entityId: inquiryId,
      summary: `Appended internal operations note to inquiry #${inquiryId} by ${authorName}.`,
    });

    // Revalidate Admin Workspaces
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${inquiryId}`);

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] addInquiryNote failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to append internal note.",
    };
  }
}
