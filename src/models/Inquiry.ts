import mongoose, { Schema, Document, Model } from "mongoose";

export type InquiryCategory =
  | "SOFTWARE_DEVELOPMENT"
  | "NETWORKING_INFRASTRUCTURE"
  | "HARDWARE_EQUIPMENT"
  | "IT_MAINTENANCE_SUPPORT"
  | "PRODUCT_INQUIRY"
  | "GENERAL";

export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "IN_PROGRESS"
  | "CLOSED"
  | "RESOLVED"
  | "SPAM";

export interface IInternalNote {
  note: string;
  authorName: string;
  createdAt: Date;
}

export interface IReferralContext {
  sourcePage?: string;
  caseStudySlug?: string;
  productSlug?: string;
}

export interface IInquiry extends Document {
  customerName: string;
  businessName?: string;
  phone: string;
  email?: string;
  serviceCategory: InquiryCategory;
  requestedServiceTitle: string;
  relatedServiceId?: mongoose.Types.ObjectId;
  relatedProductId?: mongoose.Types.ObjectId;
  location: string;
  projectDescription: string;
  referralContext?: IReferralContext;
  status: InquiryStatus;
  assignedTo?: mongoose.Types.ObjectId;
  internalNotes: IInternalNote[];
  createdAt: Date;
  updatedAt: Date;
}

const InternalNoteSchema = new Schema<IInternalNote>(
  {
    note: {
      type: String,
      required: [true, "Note text is required"],
      trim: true,
    },
    authorName: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ReferralContextSchema = new Schema<IReferralContext>(
  {
    sourcePage: { type: String, trim: true },
    caseStudySlug: { type: String, trim: true },
    productSlug: { type: String, trim: true },
  },
  { _id: false }
);

const InquirySchema = new Schema<IInquiry>(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    businessName: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Contact phone number is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    serviceCategory: {
      type: String,
      required: [true, "Service category is required"],
      enum: {
        values: [
          "SOFTWARE_DEVELOPMENT",
          "NETWORKING_INFRASTRUCTURE",
          "HARDWARE_EQUIPMENT",
          "IT_MAINTENANCE_SUPPORT",
          "PRODUCT_INQUIRY",
          "GENERAL",
        ],
        message: "{VALUE} is not a valid inquiry category",
      },
    },
    requestedServiceTitle: {
      type: String,
      required: [true, "Requested service title is required"],
      trim: true,
    },
    relatedServiceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: false,
    },
    relatedProductId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    location: {
      type: String,
      required: [true, "Location (Harar, Dire Dawa, etc.) is required"],
      trim: true,
    },
    projectDescription: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    referralContext: {
      type: ReferralContextSchema,
      required: false,
    },
    status: {
      type: String,
      enum: {
        values: ["NEW", "CONTACTED", "QUALIFIED", "IN_PROGRESS", "CLOSED", "RESOLVED", "SPAM"],
        message: "{VALUE} is not a valid inquiry status",
      },
      default: "NEW",
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    internalNotes: {
      type: [InternalNoteSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index on status and createdAt for fast lead dashboard sorting
InquirySchema.index({ status: 1, createdAt: -1 });

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
