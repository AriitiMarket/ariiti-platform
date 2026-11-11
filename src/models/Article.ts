import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArticle extends Document {
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
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImageUrl: { type: String, default: "" },
    category: {
      type: String,
      enum: ["ANNOUNCEMENT", "TECHNICAL_INSIGHT", "CASE_STUDY", "GUIDE"],
      default: "TECHNICAL_INSIGHT",
    },
    author: {
      name: { type: String, required: true, default: "Ariiti Engineering Team" },
      role: { type: String, required: true, default: "Systems Architect" },
      avatarUrl: { type: String, default: "" },
    },
    readTime: { type: String, default: "4 min read" },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

ArticleSchema.index({ isPublished: 1, publishedAt: -1 });

const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);

export default Article;
