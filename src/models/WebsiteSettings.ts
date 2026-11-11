import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialLinks {
  telegram?: string;
  linkedin?: string;
  facebook?: string;
  github?: string;
}

export interface IAnnouncementBanner {
  isActive: boolean;
  text?: string;
  linkUrl?: string;
}

export interface IWebsiteSettings extends Document {
  companyName: string;
  tagline: string;
  primaryPhone: string;
  secondaryPhone?: string;
  whatsappNumber: string;
  businessEmail: string;
  officeLocations: string[];
  socialLinks: ISocialLinks;
  announcementBanner: IAnnouncementBanner;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinksSchema = new Schema<ISocialLinks>(
  {
    telegram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    facebook: { type: String, default: "" },
    github: { type: String, default: "" },
  },
  { _id: false }
);

const AnnouncementBannerSchema = new Schema<IAnnouncementBanner>(
  {
    isActive: { type: Boolean, default: false },
    text: { type: String, default: "" },
    linkUrl: { type: String, default: "" },
  },
  { _id: false }
);

const WebsiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    companyName: {
      type: String,
      default: "Ariiti Tech",
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: "Technology Solutions That Help Your Business Grow.",
      required: true,
      trim: true,
    },
    primaryPhone: {
      type: String,
      required: [true, "Primary contact phone is required"],
      trim: true,
    },
    secondaryPhone: {
      type: String,
      required: false,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      required: [true, "WhatsApp number is required"],
      trim: true,
    },
    businessEmail: {
      type: String,
      required: [true, "Official business email is required"],
      lowercase: true,
      trim: true,
    },
    officeLocations: {
      type: [String],
      default: ["Harar, Ethiopia", "Dire Dawa, Ethiopia"],
    },
    socialLinks: {
      type: SocialLinksSchema,
      default: () => ({
        telegram: "https://t.me/aritiiteck",
        linkedin: "",
        facebook: "https://www.facebook.com/profile.php?id=61596506150647",
        github: "https://github.com/AriitiTech",
      }),
    },
    announcementBanner: {
      type: AnnouncementBannerSchema,
      default: () => ({
        isActive: false,
        text: "",
        linkUrl: "",
      }),
    },
  },
  {
    timestamps: true,
  }
);

export const WebsiteSettings: Model<IWebsiteSettings> =
  mongoose.models.WebsiteSettings ||
  mongoose.model<IWebsiteSettings>("WebsiteSettings", WebsiteSettingsSchema);

export default WebsiteSettings;
