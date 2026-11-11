import React from "react";
import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import ArticlesManager from "@/components/admin/ArticlesManager";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  await connectDB();
  const rawArticles = await Article.find().sort({ publishedAt: -1, createdAt: -1 }).lean();

  const articles = rawArticles.map((a: any) => ({
    _id: a._id.toString(),
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    coverImageUrl: a.coverImageUrl || "",
    category: a.category,
    author: {
      name: a.author?.name || "Ariiti Engineering Team",
      role: a.author?.role || "Systems Architect",
      avatarUrl: a.author?.avatarUrl || "",
    },
    readTime: a.readTime || "4 min read",
    isPublished: Boolean(a.isPublished),
    publishedAt: new Date(a.publishedAt || a.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-brand-primary" />
          <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
            Editorial Publications
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
          Articles, Engineering Insights &amp; News
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Publish engineering blog posts, technical architecture breakdowns, and official company announcements.
        </p>
      </div>

      <ArticlesManager initialArticles={articles} />
    </div>
  );
}
