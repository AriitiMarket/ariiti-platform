import React from "react";
import type { Metadata } from "next";
import PageHero from "@/components/public/PageHero";
import BlogListing from "@/components/public/BlogListing";
import RegionalPresence from "@/components/public/RegionalPresence";
import { getPublishedArticles } from "@/lib/queries/publicData";

export const metadata: Metadata = {
  title: "Blog, News & Technical Insights | Ariiti Tech",
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
        eyebrow="Insights, Updates & Technology"
        title="Field Insights, Architecture Guides & Operational News"
        description="Read technical documentation, network engineering field notes, and company announcements written directly by our resident engineering divisions in Harar and Dire Dawa."
      />

      {/* 2. Interactive Blog Listing with Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogListing initialArticles={articles} />
      </div>

      {/* 3. Physical Office Regional Presence */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RegionalPresence />
      </div>
    </div>
  );
}
