import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  quote: string;
  clientType: string;
  clientName?: string;
  location: string;
  deploymentSummary: string;
  verifiedTag: string;
  rating: number;
  isPublished: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    quote: {
      type: String,
      required: [true, "Customer quote text is required"],
      trim: true,
    },
    clientType: {
      type: String,
      required: [true, "Client or business type is required"],
      trim: true,
    },
    clientName: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Commercial location is required"],
      trim: true,
    },
    deploymentSummary: {
      type: String,
      required: [true, "Deployment summary is required"],
      trim: true,
    },
    verifiedTag: {
      type: String,
      default: "Verified Commercial Deployment",
      trim: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
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

TestimonialSchema.index({ isPublished: 1, displayOrder: 1 });

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
