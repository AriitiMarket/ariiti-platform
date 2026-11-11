"use client";

import React, { useState, useMemo } from "react";
import { IArticle } from "@/models/Article";
import BlogCard from "@/components/public/BlogCard";
import EmptyState from "@/components/ui/EmptyState";
import { Search, Filter, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogListingProps {
  initialArticles: IArticle[];
}

const CATEGORIES = [
  { key: "ALL", label: "All Insights" },
  { key: "TECHNOLOGY", label: "Technology" },
  { key: "BUSINESS_DIGITALIZATION", label: "Business Digitalization" },
  { key: "NETWORKING_IT", label: "Networking & IT" },
  { key: "SOFTWARE_DEVELOPMENT", label: "Software Development" },
  { key: "COMPANY_NEWS", label: "Company News" },
  { key: "PROJECT_UPDATES", label: "Project Updates" },
];

export const BlogListing: React.FC<BlogListingProps> = ({ initialArticles }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === "ALL") return true;

      const normCat = (article.category || "").toUpperCase().replace(/\s+/g, "_");

      if (selectedCategory === "TECHNOLOGY") {
        return normCat === "TECHNOLOGY" || normCat === "TECHNICAL_INSIGHT";
      }
      if (selectedCategory === "BUSINESS_DIGITALIZATION") {
        return (
          normCat.includes("BUSINESS") ||
          normCat.includes("DIGITAL") ||
          normCat === "GUIDE"
        );
      }
      if (selectedCategory === "NETWORKING_IT") {
        return normCat.includes("NETWORK") || normCat.includes("INFRASTRUCTURE");
      }
      if (selectedCategory === "SOFTWARE_DEVELOPMENT") {
        return normCat.includes("SOFTWARE") || normCat.includes("DEVELOPMENT");
      }
      if (selectedCategory === "COMPANY_NEWS") {
        return normCat === "COMPANY_NEWS" || normCat === "ANNOUNCEMENT";
      }
      if (selectedCategory === "PROJECT_UPDATES") {
        return normCat.includes("PROJECT") || normCat === "CASE_STUDY";
      }

      return normCat === selectedCategory;
    });
  }, [initialArticles, searchQuery, selectedCategory]);

  const featuredArticle =
    selectedCategory === "ALL" && searchQuery.trim() === "" && filteredArticles.length > 0
      ? filteredArticles[0]
      : null;

  const remainingArticles = featuredArticle
    ? filteredArticles.slice(1)
    : filteredArticles;

  return (
    <div className="space-y-10">
      {/* Search and Category Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search technical insights, articles, and updates..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#093053] focus:ring-1 focus:ring-[#093053] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-mono self-start md:self-center">
            Showing {filteredArticles.length} of {initialArticles.length} publications
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#093053]",
                  isActive
                    ? "bg-[#093053] text-white shadow-sm font-bold"
                    : "bg-[#F5F7FA] text-slate-700 hover:bg-slate-200/70"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Article Section (When not filtering/searching) */}
      {featuredArticle && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#093053]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#093053] font-mono">
              Featured Insight
            </span>
          </div>
          <BlogCard article={featuredArticle} featured={true} />
        </section>
      )}

      {/* Articles Grid */}
      {remainingArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingArticles.map((article) => (
            <BlogCard key={article.slug} article={article} />
          ))}
        </div>
      ) : !featuredArticle ? (
        <EmptyState
          title="No Publications Found"
          message={
            searchQuery
              ? `No articles matched your search query "${searchQuery}". Try a different keyword or reset filters.`
              : "No publications are currently active in this category. Check back soon for fresh technical field notes."
          }
          actionText="Reset All Filters"
          actionHref="/blog"
        />
      ) : null}
    </div>
  );
};

export default BlogListing;
