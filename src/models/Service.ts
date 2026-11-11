import mongoose, { Schema, Document, Model } from "mongoose";

export type ServiceCategory =
  | "SOFTWARE_DEVELOPMENT"
  | "NETWORKING_INFRASTRUCTURE"
  | "HARDWARE_EQUIPMENT"
  | "IT_MAINTENANCE_SUPPORT";

export interface IService extends Document {
  title: string;
  slug: string;
  category: ServiceCategory;
  summary: string;
  description: string;
  problemsSolved: string[];
  targetCustomers: string;
  whatsIncluded: string[];
  iconName?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
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
    summary: {
      type: String,
      required: [true, "Service summary is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Detailed service description is required"],
      trim: true,
    },
    problemsSolved: {
      type: [String],
      default: [],
    },
    targetCustomers: {
      type: String,
      required: [true, "Target customers description is required"],
      trim: true,
    },
    whatsIncluded: {
      type: [String],
      default: [],
    },
    iconName: {
      type: String,
      required: false,
      trim: true,
    },
    isActive: {
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

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
