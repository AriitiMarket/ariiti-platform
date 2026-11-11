import React from "react";
import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import ActivityLogsViewer from "@/components/admin/ActivityLogsViewer";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminActivityLogsPage() {
  await connectDB();
  const rawLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();

  const logs = rawLogs.map((l: any) => ({
    _id: l._id.toString(),
    actorEmail: l.actorEmail,
    action: l.action,
    entityType: l.entityType,
    entityId: l.entityId,
    summary: l.summary,
    createdAt: new Date(l.createdAt).toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <History className="w-5 h-5 text-brand-primary" />
          <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
            Security & Compliance
          </span>
        </div>
        <h1 className="text-2xl font-black text-brand-primary tracking-tight">
          System Activity Audit Logs
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable audit trail capturing all administrative mutations, publishing events, user role adjustments, and status changes.
        </p>
      </div>

      <ActivityLogsViewer logs={logs} />
    </div>
  );
}
