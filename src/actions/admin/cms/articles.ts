"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";

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
