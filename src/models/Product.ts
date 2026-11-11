import mongoose, { Schema, Document, Model } from "mongoose";

export type ProductStatus =
  | "IN_DEVELOPMENT"
  | "TESTING"
  | "AVAILABLE"
  | "TEMPORARILY_UNAVAILABLE";

export interface IProduct extends Document {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  targetCustomers: string;
  mainFeatures: string[];
  status: ProductStatus;
  accessOrDemoUrl?: string;
  logoUrl?: string;
  screenshots: string[];
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "URL slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      required: [true, "Product tagline is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    targetCustomers: {
      type: String,
      required: [true, "Target customers description is required"],
      trim: true,
    },
    mainFeatures: {
      type: [String],
      required: [true, "At least one main feature is required"],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "A product must have at least one main feature",
      },
    },
    status: {
      type: String,
      required: [true, "Product status is required"],
      enum: {
        values: [
          "IN_DEVELOPMENT",
          "TESTING",
          "AVAILABLE",
          "TEMPORARILY_UNAVAILABLE",
        ],
        message: "{VALUE} is not a valid product status",
      },
      default: "IN_DEVELOPMENT",
      index: true,
    },
    accessOrDemoUrl: {
      type: String,
      required: false,
      trim: true,
    },
    logoUrl: {
      type: String,
      required: false,
      trim: true,
    },
    screenshots: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
