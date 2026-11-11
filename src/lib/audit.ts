import mongoose from "mongoose";
import AuditLog, { AuditAction, AuditEntityType } from "@/models/AuditLog";
import connectDB from "./mongodb";

export interface LogAuditParams {
  actorId: string | mongoose.Types.ObjectId;
  actorEmail: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  summary: string;
}

/**
 * Persists an administrative activity record to the AuditLog collection.
 */
export async function logAdminAction(params: LogAuditParams): Promise<void> {
  try {
    await connectDB();
    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(params.actorId),
      actorEmail: params.actorEmail.toLowerCase().trim(),
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      summary: params.summary,
    });
  } catch (error) {
    // Fail silently in production so core operations are not blocked, but log error
    console.error("[AUDIT LOG ERROR] Failed to record admin action:", error);
  }
}
