"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { upsertArticle, deleteArticle } from "@/actions/adminCmsActions";

interface ArticleItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  category: "ANNOUNCEMENT" | "TECHNICAL_INSIGHT" | "CASE_STUDY" | "GUIDE";
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  readTime: string;
  isPublished: boolean;
  publishedAt: string;
}

interface ArticlesManagerProps {
  initialArticles: ArticleItem[];
}

export const ArticlesManager: React.FC<ArticlesManagerProps> = ({ initialArticles }) => {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    category: "TECHNICAL_INSIGHT" as ArticleItem["category"],
    authorName: "Ariiti Engineering Team",
    authorRole: "Systems Architect",
    readTime: "4 min read",
    isPublished: true,
  });

  const openAddModal = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImageUrl: "",
      category: "TECHNICAL_INSIGHT",
      authorName: "Ariiti Engineering Team",
      authorRole: "Systems Architect",
      readTime: "4 min read",
      isPublished: true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (art: ArticleItem) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: art.content,
      coverImageUrl: art.coverImageUrl || "",
      category: art.category,
      authorName: art.author?.name || "Ariiti Engineering Team",
      authorRole: art.author?.role || "Systems Architect",
      readTime: art.readTime || "4 min read",
      isPublished: art.isPublished,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingArticle ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    const payload = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt,
      content: formData.content,
      coverImageUrl: formData.coverImageUrl,
      category: formData.category,
      author: {
        name: formData.authorName,
        role: formData.authorRole,
      },
      readTime: formData.readTime,
      isPublished: formData.isPublished,
    };

    try {
      const res = await upsertArticle(payload, editingArticle?._id);
      if (res.success && res.id) {
        const savedArt: ArticleItem = {
          _id: res.id,
          title: payload.title,
          slug: payload.slug,
          excerpt: payload.excerpt,
          content: payload.content,
          coverImageUrl: payload.coverImageUrl,
          category: payload.category as ArticleItem["category"],
          author: payload.author,
          readTime: payload.readTime,
          isPublished: payload.isPublished,
          publishedAt: editingArticle?.publishedAt || new Date().toISOString(),
        };

        if (editingArticle) {
          setArticles((prev) =>
            prev.map((a) => (a._id === editingArticle._id ? savedArt : a))
          );
        } else {
          setArticles((prev) => [savedArt, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        setFormError(res.error || "Failed to save article.");
      }
    } catch (err: unknown) {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (art: ArticleItem) => {
    const updated = !art.isPublished;
    const res = await upsertArticle(
      {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        category: art.category,
        author: art.author,
        readTime: art.readTime,
        isPublished: updated,
      },
      art._id
    );

    if (res.success) {
      setArticles((prev) =>
        prev.map((a) => (a._id === art._id ? { ...a, isPublished: updated } : a))
      );
    }
  };

  const handleDelete = async (artId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete article "${title}"?`)) {
      return;
    }
    const res = await deleteArticle(artId);
    if (res.success) {
      setArticles((prev) => prev.filter((a) => a._id !== artId));
    } else {
      alert(res.error || "Failed to delete article.");
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      categoryFilter === "ALL" || art.category === categoryFilter;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles & news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ariiti-accent"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "TECHNICAL_INSIGHT", "ANNOUNCEMENT", "CASE_STUDY", "GUIDE"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? "bg-ariiti-accent text-white"
                      : "bg-slate-800/80 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat.replace(/_/g, " ")}
                </button>
              )
            )}
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-ariiti-accent hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Article Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4 text-center">Date & Read Time</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No articles published yet.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-white leading-snug">
                        {art.title}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 mt-0.5 truncate">
                        /blog/{art.slug}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-semibold border border-slate-700/60">
                        {art.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">
                        {art.author?.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {art.author?.role}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400">
                      <div className="text-[11px] font-mono">
                        {new Date(art.publishedAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {art.readTime}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(art)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors ${
                          art.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {art.isPublished ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span>PUBLISHED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-500" />
                            <span>DRAFT</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/blog/${art.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Preview Live Article"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(art)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Edit Article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(art._id, art.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative my-8">
            <h3 className="text-lg font-bold text-white tracking-tight mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-ariiti-accent" />
              <span>{editingArticle ? "Edit Article" : "Write Engineering Insight or News"}</span>
            </h3>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Designing Resilient Offline POS Architectures in Eastern Ethiopia"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ariiti-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="resilient-offline-pos"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ariiti-accent font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        category: e.target.value as ArticleItem["category"],
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-ariiti-accent"
                  >
                    <option value="TECHNICAL_INSIGHT">Technical Insight</option>
                    <option value="ANNOUNCEMENT">Official Announcement</option>
                    <option value="CASE_STUDY">Case Study Spotlight</option>
                    <option value="GUIDE">Technical Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData((p) => ({ ...p, readTime: e.target.value }))}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-ariiti-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData((p) => ({ ...p, authorName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-ariiti-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Summary / Excerpt (Displayed on blog feed) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                  placeholder="A concise executive abstract of the article..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ariiti-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Article Body (Markdown supported) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Write the full technical content, architectural diagrams, implementation notes..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ariiti-accent font-mono text-[12px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData((p) => ({ ...p, isPublished: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-700 text-ariiti-accent focus:ring-ariiti-accent"
                />
                <label htmlFor="isPublished" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Publish article live on public /blog
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-ariiti-accent hover:bg-blue-600 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingArticle ? "Update Article" : "Publish Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesManager;
