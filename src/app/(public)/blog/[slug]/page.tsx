import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getPublishedArticles } from "@/lib/queries/publicData";
import Button from "@/components/ui/Button";
import BlogCard from "@/components/public/BlogCard";
import RegionalPresence from "@/components/public/RegionalPresence";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  ArrowRight,
  ShieldCheck,
  Send,
  ExternalLink,
} from "lucide-react";

interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    return { title: "Article Not Found | Ariiti Tech" };
  }
  return {
    title: `${article.title} | Ariiti Tech Insights`,
    description: article.excerpt,
  };
}

export const revalidate = 60;

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(params.slug),
    getPublishedArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recent Publication";

  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const categoryLabel = article.category ? article.category.replace(/_/g, " ") : "Technology";

  return (
    <article className="pb-20 space-y-12">
      {/* 1. Article Hero Banner (Deep Navy #093053 with White Typography) */}
      <div className="bg-[#093053] text-white pt-8 pb-14 sm:pb-20 border-b border-[#07243e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Insights & News</span>
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/15 text-white text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded border border-white/25">
              {categoryLabel}
            </span>
            <span className="text-xs text-white/80 font-mono">
              {article.readTime || "4 min read"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal mb-6">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20 text-xs text-white/90">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white text-[#093053] flex items-center justify-center font-bold shadow-sm">
                {article.author?.name ? article.author.name.charAt(0) : "A"}
              </div>
              <div>
                <p className="font-bold text-white">{article.author?.name || "Ariiti Engineering"}</p>
                <p className="text-white/75 text-[11px]">{article.author?.role || "Technical Division"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-white/80 text-xs">
              <Calendar className="w-3.5 h-3.5 text-white/60" />
              <span>{publishedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6">
        {/* Large Cover Image */}
        {article.coverImageUrl && (
          <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 mb-10 bg-slate-900">
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Formatted Article Body */}
        <div className="bg-white rounded-2xl p-7 sm:p-12 border border-slate-200 shadow-sm text-left">
          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-4 whitespace-pre-line text-sm sm:text-base">
            {article.content}
          </div>

          {/* Social Sharing Bar */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Share2 className="w-4 h-4 text-[#093053]" />
              <span>Share Publication:</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://t.me/share/url?url=https://ariititech.com/blog/${article.slug}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#093053] hover:text-white text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://ariititech.com/blog/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#093053] hover:text-white text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Contextual CTA for Related Service */}
          <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#093053] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h3 className="font-bold text-lg text-white mb-1.5">
                Need Similar Technology Deployed at Your Facility?
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl">
                Our resident engineering team in Harar and Dire Dawa is available for direct on-site surveys, system deployments, and maintenance agreements.
              </p>
            </div>
            <Button
              href="/contact"
              variant="primary"
              size="md"
              className="shrink-0 font-bold bg-white text-[#093053] hover:bg-slate-100 shadow-sm"
            >
              <span>Request a Service</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#093053] tracking-tight">
                Related Articles &amp; Insights
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Explore more architecture breakdowns and engineering field notes.
              </p>
            </div>
            <Link
              href="/blog"
              className="text-xs font-bold text-[#093053] hover:underline inline-flex items-center gap-1"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((rel) => (
              <BlogCard key={rel.slug} article={rel} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Regional Presence */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionalPresence />
      </div>
    </article>
  );
}
