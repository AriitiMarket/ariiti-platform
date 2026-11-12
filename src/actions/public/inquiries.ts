"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import Service from "@/models/Service";
import Product from "@/models/Product";
import { inquirySchema } from "@/lib/validations/inquiry";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendInquiryNotification } from "@/lib/notifications";

export interface CreateInquiryResult {
  success: boolean;
  referenceId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Server Action for client inquiry submissions.
 * Handles IP rate limiting, bot honeypot trap, Zod validation,
 * MongoDB persistence, and non-blocking Telegram operations notification.
 */
export async function createCustomerInquiry(
  payload: unknown
): Promise<CreateInquiryResult> {
  // 1. Extract Client IP
  let clientIp = "127.0.0.1";
  try {
    const headerList = headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const realIp = headerList.get("x-real-ip");
    clientIp =
      (forwardedFor ? forwardedFor.split(",")[0].trim() : null) ||
      realIp ||
      "127.0.0.1";
  } catch {
    // Fallback when executed outside active HTTP request lifecycle (e.g. tests)
    clientIp = "127.0.0.1";
  }

  // 2. Enforce Sliding-Window Rate Limit (Max 5 requests per 15 minutes)
  const rateLimitStatus = checkRateLimit(clientIp, 5, 15 * 60 * 1000);
  if (!rateLimitStatus.allowed) {
    return {
      success: false,
      error:
        "Too many requests submitted recently. Please wait a few minutes or contact us directly via WhatsApp or phone.",
    };
  }

  // 3. Honeypot Check (Silently drop spam bots before full validation or DB queries)
  if (
    typeof payload === "object" &&
    payload !== null &&
    "honeypot" in payload &&
    typeof (payload as any).honeypot === "string" &&
    (payload as any).honeypot.trim().length > 0
  ) {
    console.warn(`[SECURITY] Bot submission trapped from IP ${clientIp} via honeypot.`);
    return {
      success: true,
      referenceId: "HONEYPOT_IGNORED",
    };
  }

  // 4. Strict Zod Schema Validation
  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await connectDB();

    // 5. Optionally resolve relatedServiceId or relatedProductId from slug if present
    let relatedServiceId: mongoose.Types.ObjectId | undefined = data.relatedServiceId
      ? new mongoose.Types.ObjectId(data.relatedServiceId)
      : undefined;

    let relatedProductId: mongoose.Types.ObjectId | undefined = data.relatedProductId
      ? new mongoose.Types.ObjectId(data.relatedProductId)
      : undefined;

    if (!relatedServiceId && data.referralContext?.caseStudySlug) {
      const matchedService = await Service.findOne({
        slug: data.referralContext.caseStudySlug,
      }).select("_id");
      if (matchedService) {
        relatedServiceId = matchedService._id;
      }
    }

    if (!relatedProductId && data.referralContext?.productSlug) {
      const matchedProduct = await Product.findOne({
        slug: data.referralContext.productSlug,
      }).select("_id");
      if (matchedProduct) {
        relatedProductId = matchedProduct._id;
      }
    }

    // 6. Create Inquiry in MongoDB
    const newInquiry = await Inquiry.create({
      customerName: data.customerName,
      businessName: data.businessName || undefined,
      phone: data.phone,
      email: data.email || undefined,
      serviceCategory: data.serviceCategory,
      requestedServiceTitle: data.requestedServiceTitle,
      relatedServiceId,
      relatedProductId,
      location: data.location,
      projectDescription: data.projectDescription,
      referralContext: data.referralContext,
      status: "NEW",
    });

    const referenceId = newInquiry._id.toString().slice(-6).toUpperCase();

    // 7. Non-blocking Telegram Notification Dispatch
    sendInquiryNotification({
      id: referenceId,
      customerName: data.customerName,
      businessName: data.businessName || undefined,
      phone: data.phone,
      email: data.email || undefined,
      serviceCategory: data.serviceCategory,
      requestedServiceTitle: data.requestedServiceTitle,
      location: data.location,
      projectDescription: data.projectDescription,
      referralContext: data.referralContext,
    }).catch((err) => {
      console.warn("[NOTIFICATION BACKGROUND ERROR]", err);
    });

    // 8. Revalidate Admin Paths for Fresh Real-Time Lists
    try {
      revalidatePath("/admin");
      revalidatePath("/admin/inquiries");
    } catch {
      // In testing environments or static contexts revalidatePath is a no-op
    }

    return {
      success: true,
      referenceId,
    };
  } catch (error: any) {
    console.error("[INQUIRY ACTION ERROR]", error);
    return {
      success: false,
      error:
        "An unexpected system error occurred while recording your inquiry. Please reach out to us directly via WhatsApp or telephone.",
    };
  }
}
