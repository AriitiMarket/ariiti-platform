"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product, { ProductStatus } from "@/models/Product";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validations/product";

const VALID_PRODUCT_STATUSES: ProductStatus[] = [
  "AVAILABLE",
  "TESTING",
  "IN_DEVELOPMENT",
  "TEMPORARILY_UNAVAILABLE",
];

export async function updateProductLifecycle(productId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (!VALID_PRODUCT_STATUSES.includes(status as ProductStatus)) {
    return { success: false, error: `Invalid product lifecycle status: ${status}` };
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return { success: false, error: "Invalid product ID format." };
  }

  try {
    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, error: "Product not found." };
    }

    const previousStatus = product.status;
    product.status = status as ProductStatus;
    await product.save();

    // Atomic Audit Log
    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "staff@ariititech.com",
      action: "STATUS_CHANGE",
      entityType: "PRODUCT",
      entityId: productId,
      summary: `Updated product "${product.name}" lifecycle status from [${previousStatus}] to [${status}].`,
    });

    // On-Demand ISR
    revalidatePath("/portfolio");
    revalidatePath("/products");
    revalidatePath("/services");
    revalidatePath("/");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] updateProductLifecycle failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product status.",
    };
  }
}

export async function upsertProduct(payload: unknown, id?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot author or edit products.",
    };
  }

  try {
    await connectDB();

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid product ID format." };
      }

      const parsed = updateProductSchema.safeParse(payload);
      if (!parsed.success) {
        return {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        };
      }

      const existing = await Product.findById(id);
      if (!existing) {
        return { success: false, error: "Product not found." };
      }

      Object.assign(existing, parsed.data);
      await existing.save();

      // Atomic Audit Log
      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "UPDATE",
        entityType: "PRODUCT",
        entityId: id,
        summary: `Updated ecosystem product details for "${existing.name}".`,
      });

      // On-Demand ISR
      revalidatePath("/portfolio");
      revalidatePath("/products");
      revalidatePath("/services");
      revalidatePath("/");
      revalidatePath("/admin/products");

      return { success: true, id: existing._id.toString() };
    } else {
      const parsed = createProductSchema.safeParse(payload);
      if (!parsed.success) {
        return {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        };
      }

      // Check slug uniqueness
      const slugExists = await Product.findOne({ slug: parsed.data.slug });
      if (slugExists) {
        return {
          success: false,
          error: "A product with this slug already exists. Please choose another slug.",
        };
      }

      const newProduct = await Product.create(parsed.data);

      // Atomic Audit Log
      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "CREATE",
        entityType: "PRODUCT",
        entityId: newProduct._id.toString(),
        summary: `Created new ecosystem software product "${newProduct.name}".`,
      });

      // On-Demand ISR
      revalidatePath("/portfolio");
      revalidatePath("/products");
      revalidatePath("/services");
      revalidatePath("/");
      revalidatePath("/admin/products");

      return { success: true, id: newProduct._id.toString() };
    }
  } catch (error: unknown) {
    console.error("[ERROR] upsertProduct failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save product.",
    };
  }
}
