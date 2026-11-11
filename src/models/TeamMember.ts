import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  department: string;
  bio: string;
  location: string;
  skills: string[];
  imageUrl?: string;
  inquiryTopic?: string;
  inquiryHref?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters."],
    },
    role: {
      type: String,
      required: [true, "Role title is required."],
      trim: true,
      maxlength: [120, "Role cannot exceed 120 characters."],
    },
    department: {
      type: String,
      required: [true, "Department is required."],
      trim: true,
      maxlength: [120, "Department cannot exceed 120 characters."],
    },
    bio: {
      type: String,
      required: [true, "Bio description is required."],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
      maxlength: [120, "Location cannot exceed 120 characters."],
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required."],
      default: [],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    },
    inquiryTopic: {
      type: String,
      trim: true,
      default: "Technical Consultation",
    },
    inquiryHref: {
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

TeamMemberSchema.index({ order: 1, createdAt: -1 });

const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

export default TeamMember;
