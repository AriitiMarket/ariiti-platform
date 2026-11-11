import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getPublishedArticles } from "@/lib/queries/publicData";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
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
    title: `${article.title} | Ariiti Tech`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="pb-20">
      {/* Top Breadcrumb & Hero */}
      <div className="bg-slate-950 text-white pt-8 pb-14 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Technical Articles & News</span>
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="bg-ariiti-accent text-white text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded">
              {article.category.replace(/_/g, " ")}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {article.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-6">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="w-9 h-9 rounded-full bg-ariiti-navy flex items-center justify-center font-bold text-white border border-slate-700">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-white">{article.author.name}</p>
              <p className="text-slate-400 text-[11px]">{article.author.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6">
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

        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm text-left prose prose-slate max-w-none">
          <div className="whitespace-pre-line text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
            {article.content}
          </div>

          {/* Contextual CTA for Related Service */}
          <div className="mt-12 p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-ariiti-navy mb-1">
                Need similar infrastructure deployed at your facility?
              </h3>
              <p className="text-xs text-slate-600">
                Our resident engineering team in Harar and Dire Dawa is available for direct on-site surveys and SLA maintenance.
              </p>
            </div>
            <Button
              href="/contact"
              variant="primary"
              size="sm"
              className="shrink-0 font-bold"
            >
              <span>Request Service Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
