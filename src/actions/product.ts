"use server";

import connectDB from "@/lib/mongodb";
import Product, { IProduct, ProductStatus } from "@/models/Product";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validations/product";
import { logAdminAction } from "@/lib/audit";
import { ServerActionResult } from "./inquiry";

/**
 * Public action: Get published products.
 */
export async function getPublishedProducts(
  status?: ProductStatus
): Promise<ServerActionResult<IProduct[]>> {
  try {
    await connectDB();

    const query: Record<string, any> = { isPublished: true };
    if (status) {
      query.status = status;
    }

    const products = await Product.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(products)),
    };
  } catch (error: any) {
    console.error("[GET PUBLISHED PRODUCTS ERROR]", error);
    return { success: false, message: "Failed to fetch software products." };
  }
}

/**
 * Public action: Get single product by slug.
 */
export async function getProductBySlug(
  slug: string
): Promise<ServerActionResult<IProduct | null>> {
  try {
    await connectDB();

    const product = await Product.findOne({
      slug: slug.toLowerCase().trim(),
      isPublished: true,
    }).lean();

    if (!product) {
      return { success: false, message: "Product not found." };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(product)),
    };
  } catch (error: any) {
    console.error("[GET PRODUCT BY SLUG ERROR]", error);
    return { success: false, message: "Failed to fetch product details." };
  }
}

/**
 * Admin action: Create a new product.
 */
export async function createProduct(
  rawInput: unknown,
  adminUser?: { id: string; email: string }
): Promise<ServerActionResult> {
  const parsed = createProductSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed for product creation.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    const exists = await Product.findOne({ slug: parsed.data.slug });
    if (exists) {
      return {
        success: false,
        message: "A product with this URL slug already exists.",
      };
    }

    const created = await Product.create(parsed.data);

    if (adminUser) {
      await logAdminAction({
        actorId: adminUser.id,
        actorEmail: adminUser.email,
        action: "CREATE",
        entityType: "PRODUCT",
        entityId: created._id.toString(),
        summary: `Created new product: ${created.name}`,
      });
    }

    return {
      success: true,
      message: "Product created successfully.",
      data: JSON.parse(JSON.stringify(created)),
    };
  } catch (error: any) {
    console.error("[CREATE PRODUCT ERROR]", error);
    return { success: false, message: "Failed to create product." };
  }
}

/**
 * Admin action: Update an existing product.
 */
export async function updateProduct(
  id: string,
  rawInput: unknown,
  adminUser?: { id: string; email: string }
): Promise<ServerActionResult> {
  const parsed = updateProductSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed for product update.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    if (parsed.data.slug) {
      const conflict = await Product.findOne({
        slug: parsed.data.slug,
        _id: { $ne: id },
      });
      if (conflict) {
        return {
          success: false,
          message: "Another product already uses this URL slug.",
        };
      }
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Product not found." };
    }

    if (adminUser) {
      await logAdminAction({
        actorId: adminUser.id,
        actorEmail: adminUser.email,
        action: "UPDATE",
        entityType: "PRODUCT",
        entityId: id,
        summary: `Updated product: ${updated.name}`,
      });
    }

    return {
      success: true,
      message: "Product updated successfully.",
      data: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error: any) {
    console.error("[UPDATE PRODUCT ERROR]", error);
    return { success: false, message: "Failed to update product." };
  }
}
