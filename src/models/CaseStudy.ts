import mongoose, { Schema, Document, Model } from "mongoose";
import { ServiceCategory } from "./Service";

export type ProjectType =
  | "CLIENT_DEPLOYMENT"
  | "INTERNAL_ECOSYSTEM_PRODUCT"
  | "TECHNICAL_DEMONSTRATION";

export type ProjectStatus = "COMPLETED" | "ONGOING_SUPPORT" | "PILOT_STAGE";

export type PublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  category: ServiceCategory;
  projectType: ProjectType;
  clientSector: string;
  clientName?: string;
  isClientConfidential: boolean;
  location: string;
  summary: string;
  problemAddressed: string;
  solutionImplemented: string;
  technologiesAndEquipment: string[];
  measurableOutcomes: string[];
  coverImageUrl: string;
  galleryImageUrls: string[];
  liveOrDemoUrl?: string;
  projectStatus: ProjectStatus;
  publicationStatus: PublicationStatus;
  isFeatured: boolean;
  completedAt?: Date;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    title: {
      type: String,
      required: [true, "Case study title is required"],
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
    category: {
      type: String,
      required: [true, "Service category is required"],
      enum: {
        values: [
          "SOFTWARE_DEVELOPMENT",
          "NETWORKING_INFRASTRUCTURE",
          "HARDWARE_EQUIPMENT",
          "IT_MAINTENANCE_SUPPORT",
        ],
        message: "{VALUE} is not a valid service category",
      },
      index: true,
    },
    projectType: {
      type: String,
      required: [true, "Project type is required"],
      enum: {
        values: [
          "CLIENT_DEPLOYMENT",
          "INTERNAL_ECOSYSTEM_PRODUCT",
          "TECHNICAL_DEMONSTRATION",
        ],
        message: "{VALUE} is not a valid project type",
      },
      index: true,
    },
    clientSector: {
      type: String,
      required: [true, "Client industry sector is required"],
      trim: true,
    },
    clientName: {
      type: String,
      required: false,
      trim: true,
    },
    isClientConfidential: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      required: [true, "Project location is required (e.g., Harar, Dire Dawa)"],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "Executive summary is required"],
      trim: true,
    },
    problemAddressed: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
    },
    solutionImplemented: {
      type: String,
      required: [true, "Solution description is required"],
      trim: true,
    },
    technologiesAndEquipment: {
      type: [String],
      required: [true, "At least one technology or hardware component is required"],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "Must specify at least one technology or equipment item",
      },
    },
    measurableOutcomes: {
      type: [String],
      default: [],
    },
    coverImageUrl: {
      type: String,
      required: [true, "Cover image URL is required"],
      trim: true,
    },
    galleryImageUrls: {
      type: [String],
      default: [],
    },
    liveOrDemoUrl: {
      type: String,
      required: false,
      trim: true,
    },
    projectStatus: {
      type: String,
      enum: {
        values: ["COMPLETED", "ONGOING_SUPPORT", "PILOT_STAGE"],
        message: "{VALUE} is not a valid project status",
      },
      default: "COMPLETED",
    },
    publicationStatus: {
      type: String,
      enum: {
        values: ["DRAFT", "PUBLISHED", "ARCHIVED"],
        message: "{VALUE} is not a valid publication status",
      },
      default: "DRAFT",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
      required: false,
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

export const CaseStudy: Model<ICaseStudy> =
  mongoose.models.CaseStudy ||
  mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);

export default CaseStudy;
