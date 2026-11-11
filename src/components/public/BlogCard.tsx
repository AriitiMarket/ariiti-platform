import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IArticle } from "@/models/Article";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  article: IArticle;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  article,
  featured = false,
}) => {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  const categoryLabel = article.category ? article.category.replace(/_/g, " ") : "Technology";

  if (featured) {
    return (
      <article className="flex flex-col lg:flex-row bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden text-left group">
        {/* Large Featured Cover Image */}
        <div className="relative h-64 lg:h-auto lg:w-1/2 bg-[#093053] overflow-hidden shrink-0">
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-[#093053] flex items-center justify-center text-white font-bold text-lg">
              Featured Insight
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(rgba(9, 48, 83, 0.25), rgba(9, 48, 83, 0.75))",
            }}
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white text-[#093053] font-mono text-xs font-bold uppercase px-3 py-1.5 rounded-lg shadow-sm">
              Featured • {categoryLabel}
            </span>
          </div>
        </div>

        {/* Featured Content Body */}
        <div className="p-7 sm:p-9 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {publishedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTime || "4 min read"}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#093053] tracking-tight mb-3 leading-snug group-hover:text-[#07243e] transition-colors">
              <Link href={`/blog/${article.slug}`}>{article.title}</Link>
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#093053]/10 flex items-center justify-center text-[#093053] font-bold text-xs">
                {article.author?.name ? article.author.name.charAt(0) : "A"}
              </div>
              <span className="text-xs font-bold text-slate-700">
                {article.author?.name || "Ariiti Engineering"}
              </span>
            </div>

            <Link
              href={`/blog/${article.slug}`}
              className="text-xs sm:text-sm font-bold text-[#093053] hover:underline inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden text-left group">
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-[#093053] overflow-hidden shrink-0">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          />
        ) : (
          <div className="w-full h-full bg-[#093053] flex items-center justify-center text-white font-bold">
            Ariiti Tech Insights
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(9, 48, 83, 0.2), rgba(9, 48, 83, 0.8))",
          }}
        />
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="bg-[#093053]/90 text-white border border-white/20 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md backdrop-blur-sm">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Date and Read Time */}
          <div className="flex items-center gap-2.5 text-xs text-slate-500 mb-3 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {article.readTime || "4 min read"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#093053] tracking-tight mb-2.5 group-hover:text-[#07243e] transition-colors leading-snug line-clamp-2">
            <Link href={`/blog/${article.slug}`}>{article.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        {/* Card Footer: Author and Read Article Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[140px]">
              {article.author?.name || "Ariiti Team"}
            </span>
          </span>

          <Link
            href={`/blog/${article.slug}`}
            className="text-xs font-bold text-[#093053] hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
