import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/public/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import TrustMetricsBanner from "@/components/public/TrustMetricsBanner";
import RegionalPresence from "@/components/public/RegionalPresence";
import { getPublishedArticles } from "@/lib/queries/publicData";
import { Calendar, Clock, ArrowRight, User, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Technical Articles & Company News | Ariiti Tech",
  description:
    "Explore engineering insights, infrastructure deployment guides, and company announcements from Ariiti Tech in Eastern Ethiopia.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Page Hero */}
      <PageHero
        eyebrow="Company News & Technical Insights"
        title="Field Insights, Architecture Guides & Operational News"
        description="Read technical documentation, network engineering field notes, and company announcements written directly by our resident engineering divisions in Harar and Dire Dawa."
      />

      {/* 2. Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden text-left group"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                {article.coverImageUrl ? (
                  <Image
                    src={article.coverImageUrl}
                    alt={article.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  />
                ) : (
                  <div className="w-full h-full bg-ariiti-navy flex items-center justify-center text-white font-bold">
                    Ariiti Tech Insights
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="bg-ariiti-navy/90 text-white border border-white/20 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {article.category.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {article.author.name}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-ariiti-navy tracking-tight mb-2 group-hover:text-ariiti-accent transition-colors leading-snug">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-xs font-bold text-ariiti-navy hover:text-ariiti-accent flex items-center gap-1 transition-colors"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 3. Physical Office Regional Presence */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionalPresence />
      </div>
    </div>
  );
}
