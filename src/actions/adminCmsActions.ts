"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import CaseStudy from "@/models/CaseStudy";
import Product, { ProductStatus } from "@/models/Product";
import Service from "@/models/Service";
import Article from "@/models/Article";
import Testimonial from "@/models/Testimonial";
import Inquiry from "@/models/Inquiry";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";
import {
  createCaseStudySchema,
  updateCaseStudySchema,
} from "@/lib/validations/caseStudy";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validations/product";
import {
  createServiceSchema,
  updateServiceSchema,
} from "@/lib/validations/service";

export async function upsertCaseStudy(payload: unknown, id?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  // Content managers and Super admins can edit case studies
  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot author case studies.",
    };
  }

  try {
    await connectDB();

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid case study ID format." };
      }

      const parsed = updateCaseStudySchema.safeParse(payload);
      if (!parsed.success) {
        return {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        };
      }

      const existing = await CaseStudy.findById(id);
      if (!existing) {
        return { success: false, error: "Case study not found." };
      }

      Object.assign(existing, parsed.data);
      await existing.save();

      // Atomic Audit Log
      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "UPDATE",
        entityType: "CASE_STUDY",
        entityId: id,
        summary: `Updated case study "${existing.title}" (Status: ${existing.publicationStatus}).`,
      });

      // On-Demand ISR
      revalidatePath("/portfolio");
      revalidatePath(`/portfolio/${existing.slug}`);
      revalidatePath("/products");
      revalidatePath("/services");
      revalidatePath("/");
      revalidatePath("/admin/case-studies");

      return { success: true, id: existing._id.toString(), slug: existing.slug };
    } else {
      const parsed = createCaseStudySchema.safeParse(payload);
      if (!parsed.success) {
        return {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        };
      }

      // Check slug uniqueness
      const slugExists = await CaseStudy.findOne({ slug: parsed.data.slug });
      if (slugExists) {
        return {
          success: false,
          error: "A case study with this slug already exists. Please modify the slug.",
        };
      }

      const newCaseStudy = await CaseStudy.create(parsed.data);

      // Atomic Audit Log
      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "CREATE",
        entityType: "CASE_STUDY",
        entityId: newCaseStudy._id.toString(),
        summary: `Created new corporate case study "${newCaseStudy.title}".`,
      });

      // On-Demand ISR
      revalidatePath("/portfolio");
      revalidatePath(`/portfolio/${newCaseStudy.slug}`);
      revalidatePath("/products");
      revalidatePath("/services");
      revalidatePath("/");
      revalidatePath("/admin/case-studies");

      return {
        success: true,
        id: newCaseStudy._id.toString(),
        slug: newCaseStudy.slug,
      };
    }
  } catch (error: unknown) {
    console.error("[ERROR] upsertCaseStudy failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save case study.",
    };
  }
}

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

export async function deleteCaseStudy(caseStudyId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot delete case studies.",
    };
  }

  if (!mongoose.Types.ObjectId.isValid(caseStudyId)) {
    return { success: false, error: "Invalid case study ID format." };
  }

  try {
    await connectDB();

    const caseStudy = await CaseStudy.findByIdAndDelete(caseStudyId);
    if (!caseStudy) {
      return { success: false, error: "Case study not found." };
    }

    // Atomic Audit Log
    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "staff@ariititech.com",
      action: "DELETE",
      entityType: "CASE_STUDY",
      entityId: caseStudyId,
      summary: `Deleted case study "${caseStudy.title}".`,
    });

    // On-Demand ISR
    revalidatePath("/portfolio");
    revalidatePath("/products");
    revalidatePath("/services");
    revalidatePath("/");
    revalidatePath("/admin/case-studies");

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] deleteCaseStudy failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete case study.",
    };
  }
}

export async function upsertService(payload: unknown, id?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot author services.",
    };
  }

  try {
    await connectDB();

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid service ID format." };
      }

      const parsed = updateServiceSchema.safeParse(payload);
      if (!parsed.success) {
        return {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        };
      }

      const existing = await Service.findById(id);
      if (!existing) {
        return { success: false, error: "Service not found." };
      }

      Object.assign(existing, parsed.data);
      await existing.save();

      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "UPDATE",
        entityType: "SERVICE",
        entityId: id,
        summary: `Updated service "${existing.title}".`,
      });

      revalidatePath("/services");
      revalidatePath(`/services/${existing.slug}`);
      revalidatePath("/");
      revalidatePath("/admin/services");

      return { success: true, id: existing._id.toString() };
    } else {
      const parsed = createServiceSchema.safeParse(payload);
      if (!parsed.success) {
        return {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        };
      }

      const slugExists = await Service.findOne({ slug: parsed.data.slug });
      if (slugExists) {
        return {
          success: false,
          error: "A service with this slug already exists.",
        };
      }

      const newService = await Service.create(parsed.data);

      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "CREATE",
        entityType: "SERVICE",
        entityId: newService._id.toString(),
        summary: `Created new service "${newService.title}".`,
      });

      revalidatePath("/services");
      revalidatePath("/");
      revalidatePath("/admin/services");

      return { success: true, id: newService._id.toString() };
    }
  } catch (error: unknown) {
    console.error("[ERROR] upsertService failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save service.",
    };
  }
}

export async function deleteService(serviceId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot delete services.",
    };
  }

  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    return { success: false, error: "Invalid service ID format." };
  }

  try {
    await connectDB();
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) {
      return { success: false, error: "Service not found." };
    }

    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "staff@ariititech.com",
      action: "DELETE",
      entityType: "SERVICE",
      entityId: serviceId,
      summary: `Deleted service "${service.title}".`,
    });

    revalidatePath("/services");
    revalidatePath("/");
    revalidatePath("/admin/services");

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] deleteService failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete service.",
    };
  }
}

export async function upsertArticle(payload: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category?: string;
  coverImageUrl?: string;
  readTime?: string;
  isPublished?: boolean;
  author?: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}, id?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot author articles.",
    };
  }

  try {
    await connectDB();

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid article ID." };
      }

      const existing = await Article.findById(id);
      if (!existing) {
        return { success: false, error: "Article not found." };
      }

      Object.assign(existing, payload);
      await existing.save();

      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "UPDATE",
        entityType: "ARTICLE",
        entityId: id,
        summary: `Updated article "${existing.title}".`,
      });

      revalidatePath("/blog");
      revalidatePath(`/blog/${existing.slug}`);
      revalidatePath("/admin/articles");

      return { success: true, id: existing._id.toString() };
    } else {
      const exists = await Article.findOne({ slug: payload.slug });
      if (exists) {
        return { success: false, error: "An article with this slug already exists." };
      }

      const newArticle = await Article.create({
        ...payload,
        author: payload.author || {
          name: session.user.name || "Ariiti Engineering Team",
          role: "Operations Lead",
        },
      });

      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "CREATE",
        entityType: "ARTICLE",
        entityId: newArticle._id.toString(),
        summary: `Created article "${newArticle.title}".`,
      });

      revalidatePath("/blog");
      revalidatePath("/admin/articles");

      return { success: true, id: newArticle._id.toString() };
    }
  } catch (error: unknown) {
    console.error("[ERROR] upsertArticle failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save article.",
    };
  }
}

export async function deleteArticle(articleId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot delete articles.",
    };
  }

  try {
    await connectDB();
    const article = await Article.findByIdAndDelete(articleId);
    if (!article) return { success: false, error: "Article not found." };

    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "staff@ariititech.com",
      action: "DELETE",
      entityType: "ARTICLE",
      entityId: articleId,
      summary: `Deleted article "${article.title}".`,
    });

    revalidatePath("/blog");
    revalidatePath("/admin/articles");

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] deleteArticle failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete article.",
    };
  }
}

export async function globalAdminSearch(query: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  if (!query || query.trim().length < 2) {
    return { success: true, results: [] };
  }

  const q = query.trim();
  const regex = new RegExp(q, "i");

  try {
    await connectDB();

    const [inquiries, caseStudies, products, services] = await Promise.all([
      Inquiry.find({
        $or: [
          { referenceNumber: regex },
          { customerName: regex },
          { businessName: regex },
          { phone: regex },
        ],
      })
        .select("referenceNumber customerName status createdAt")
        .limit(5)
        .lean(),
      CaseStudy.find({ title: regex })
        .select("title slug publicationStatus")
        .limit(5)
        .lean(),
      Product.find({ name: regex })
        .select("name slug status")
        .limit(5)
        .lean(),
      Service.find({ title: regex })
        .select("title slug category isActive")
        .limit(5)
        .lean(),
    ]);

    const results = [
      ...inquiries.map((i: any) => ({
        type: "Inquiry",
        title: `${i.referenceNumber} - ${i.customerName}`,
        badge: i.status,
        href: `/admin/inquiries/${i._id}`,
      })),
      ...caseStudies.map((c: any) => ({
        type: "Case Study",
        title: c.title,
        badge: c.publicationStatus,
        href: `/admin/case-studies`,
      })),
      ...products.map((p: any) => ({
        type: "Product",
        title: p.name,
        badge: p.status,
        href: `/admin/products`,
      })),
      ...services.map((s: any) => ({
        type: "Service",
        title: s.title,
        badge: s.isActive ? "ACTIVE" : "INACTIVE",
        href: `/admin/services`,
      })),
    ];

    return { success: true, results };
  } catch (error: unknown) {
    console.error("[ERROR] globalAdminSearch failed:", error);
    return { success: false, error: "Search failed." };
  }
}

export async function upsertTestimonial(
  payload: {
    quote: string;
    clientType: string;
    clientName?: string;
    location: string;
    deploymentSummary: string;
    verifiedTag?: string;
    rating?: number;
    isPublished?: boolean;
    displayOrder?: number;
  },
  id?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot manage testimonials.",
    };
  }

  if (!payload.quote || !payload.clientType || !payload.location || !payload.deploymentSummary) {
    return { success: false, error: "Quote, client type, location, and deployment summary are required." };
  }

  try {
    await connectDB();

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid testimonial ID." };
      }

      const existing = await Testimonial.findById(id);
      if (!existing) {
        return { success: false, error: "Testimonial not found." };
      }

      Object.assign(existing, payload);
      await existing.save();

      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "UPDATE",
        entityType: "TESTIMONIAL",
        entityId: id,
        summary: `Updated testimonial for "${existing.clientType} (${existing.location})".`,
      });

      revalidatePath("/");
      revalidatePath("/admin/testimonials");

      return { success: true, id: existing._id.toString() };
    } else {
      const newTestimonial = await Testimonial.create({
        ...payload,
        verifiedTag: payload.verifiedTag || "Verified Commercial Deployment",
        rating: payload.rating || 5,
        isPublished: payload.isPublished ?? true,
        displayOrder: payload.displayOrder || 0,
      });

      await AuditLog.create({
        actorId: new mongoose.Types.ObjectId(session.user.id),
        actorEmail: session.user.email || "staff@ariititech.com",
        action: "CREATE",
        entityType: "TESTIMONIAL",
        entityId: newTestimonial._id.toString(),
        summary: `Created testimonial for "${newTestimonial.clientType} (${newTestimonial.location})".`,
      });

      revalidatePath("/");
      revalidatePath("/admin/testimonials");

      return { success: true, id: newTestimonial._id.toString() };
    }
  } catch (error: unknown) {
    console.error("[ERROR] upsertTestimonial failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save testimonial.",
    };
  }
}

export async function deleteTestimonial(testimonialId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access: Please log in." };
  }

  if (session.user.role === "OPERATIONS") {
    return {
      success: false,
      error: "Permission denied: Operations role cannot delete testimonials.",
    };
  }

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(testimonialId)) {
      return { success: false, error: "Invalid testimonial ID." };
    }

    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial) {
      return { success: false, error: "Testimonial not found." };
    }

    await Testimonial.findByIdAndDelete(testimonialId);

    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(session.user.id),
      actorEmail: session.user.email || "staff@ariititech.com",
      action: "DELETE",
      entityType: "TESTIMONIAL",
      entityId: testimonialId,
      summary: `Deleted testimonial for "${testimonial.clientType}".`,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { success: true };
  } catch (error: unknown) {
    console.error("[ERROR] deleteTestimonial failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete testimonial.",
    };
  }
}
