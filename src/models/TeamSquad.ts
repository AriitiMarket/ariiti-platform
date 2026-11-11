import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeamSquad extends Document {
  unitName: string;
  designation: string;
  specialization: string;
  overview?: string;
  dispatchHubs: string;
  keyCompetencies: string[];
  imageUrl?: string;
  ctaText?: string;
  ctaHref?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSquadSchema = new Schema<ITeamSquad>(
  {
    unitName: {
      type: String,
      required: [true, "Unit name is required."],
      trim: true,
      maxlength: [150, "Unit name cannot exceed 150 characters."],
    },
    designation: {
      type: String,
      required: [true, "Designation is required."],
      trim: true,
      maxlength: [150, "Designation cannot exceed 150 characters."],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required."],
      trim: true,
      maxlength: [200, "Specialization cannot exceed 200 characters."],
    },
    overview: {
      type: String,
      trim: true,
      default: "",
    },
    dispatchHubs: {
      type: String,
      required: [true, "Dispatch hub is required."],
      trim: true,
      maxlength: [200, "Dispatch hubs cannot exceed 200 characters."],
    },
    keyCompetencies: {
      type: [String],
      required: [true, "At least one competency is required."],
      default: [],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
    },
    ctaText: {
      type: String,
      trim: true,
      default: "Inquire on Engineering",
    },
    ctaHref: {
      type: String,
      trim: true,
      default: "/contact",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

TeamSquadSchema.index({ order: 1, createdAt: -1 });

const TeamSquad: Model<ITeamSquad> =
  mongoose.models.TeamSquad || mongoose.model<ITeamSquad>("TeamSquad", TeamSquadSchema);

export default TeamSquad;
