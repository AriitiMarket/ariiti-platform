import mongoose, { Schema, Document, Model } from "mongoose";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "STATUS_CHANGE"
  | "LOGIN";

export type AuditEntityType =
  | "SERVICE"
  | "PRODUCT"
  | "CASE_STUDY"
  | "INQUIRY"
  | "SETTINGS"
  | "USER"
  | "ARTICLE"
  | "TESTIMONIAL";

export interface IAuditLog extends Document {
  actorId: mongoose.Types.ObjectId;
  actorEmail: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Actor user ID is required"],
      index: true,
    },
    actorEmail: {
      type: String,
      required: [true, "Actor email is required"],
      trim: true,
      lowercase: true,
    },
    action: {
      type: String,
      required: [true, "Action type is required"],
      enum: {
        values: ["CREATE", "UPDATE", "DELETE", "STATUS_CHANGE", "LOGIN"],
        message: "{VALUE} is not a valid audit action",
      },
      index: true,
    },
    entityType: {
      type: String,
      required: [true, "Entity type is required"],
      enum: {
        values: [
          "SERVICE",
          "PRODUCT",
          "CASE_STUDY",
          "INQUIRY",
          "SETTINGS",
          "USER",
          "ARTICLE",
          "TESTIMONIAL",
        ],
        message: "{VALUE} is not a valid entity type",
      },
      index: true,
    },
    entityId: {
      type: String,
      required: [true, "Target entity ID is required"],
      index: true,
    },
    summary: {
      type: String,
      required: [true, "Human-readable summary of the action is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying recent actions per entity or actor
AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
