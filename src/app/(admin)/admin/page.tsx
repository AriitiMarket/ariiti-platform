import React from "react";
import Link from "next/link";
import {
  Inbox,
  FileCode,
  Box,
  Wrench,
  FileText,
  Users,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Phone,
  Plus,
  ShieldCheck,
  History,
  MessageSquare,
} from "lucide-react";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import CaseStudy from "@/models/CaseStudy";
import Product from "@/models/Product";
import Service from "@/models/Service";
import Article from "@/models/Article";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverviewPage() {
  await connectDB();

  const [
    totalInquiries,
    newInquiries,
    inProgressInquiries,
    totalCaseStudies,
    publishedCaseStudies,
    totalProducts,
    totalServices,
    activeServices,
    totalArticles,
    publishedArticles,
    totalUsers,
    recentInquiries,
    recentAuditLogs,
  ] = await Promise.all([
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "NEW" }),
    Inquiry.countDocuments({ status: "IN_PROGRESS" }),
    CaseStudy.countDocuments(),
    CaseStudy.countDocuments({ publicationStatus: "PUBLISHED" }),
    Product.countDocuments({ isPublished: true }),
    Service.countDocuments(),
    Service.countDocuments({ isActive: true }),
    Article.countDocuments(),
    Article.countDocuments({ isPublished: true }),
    User.countDocuments({ isActive: true }),
    Inquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
    AuditLog.find().sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-ariiti-accent font-bold">
            Enterprise Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry on customer leads, active infrastructure deployments, content publication, and audit logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/case-studies/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ariiti-accent hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Link>
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </Link>
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Article</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
          >
            <Inbox className="w-3.5 h-3.5 text-blue-400" />
            <span>View Inquiries ({newInquiries})</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards Grid (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Customer Inquiries
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Inbox className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {totalInquiries}
            </span>
            {newInquiries > 0 ? (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono animate-pulse">
                {newInquiries} NEW
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">0 pending</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {inProgressInquiries} in active follow-up
          </p>
        </div>

        {/* Portfolio Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Portfolio Projects
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FileCode className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {publishedCaseStudies}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / {totalCaseStudies} total
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            Verified regional deployments
          </p>
        </div>

        {/* Active Services */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Active Services
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Wrench className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {activeServices}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / {totalServices} total
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            Software, Networks, Support
          </p>
        </div>

        {/* Software Products */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Ecosystem Products
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Box className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {totalProducts}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              LIVE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            POS, Desk, NetManager, Sync
          </p>
        </div>

        {/* Technical Articles */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Articles & News
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {publishedArticles}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / {totalArticles} total
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            Public engineering insights
          </p>
        </div>

        {/* Admin Team Members */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Admin Users
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {totalUsers}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Active staff
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            RBAC permissions enforced
          </p>
        </div>

        {/* Operations Hubs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Operational Hubs
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              2
            </span>
            <span className="text-[10px] font-mono text-teal-400">
              Harar & Dire Dawa
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            Field technicians on standby
          </p>
        </div>

        {/* Uncontacted Inquiries Alert */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              SLA Priority Alert
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {newInquiries}
            </span>
            <span className="text-[10px] font-bold text-rose-400 font-mono">
              Pending Contact
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {newInquiries > 0
              ? "Action required within 2h window"
              : "All inquiries are handled"}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Recent Inquiries + Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Inquiries (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-ariiti-accent" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Recent Customer Leads
              </h3>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-ariiti-accent hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No inquiries registered yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentInquiries.map((inq: any) => (
                <Link
                  key={inq._id.toString()}
                  href={`/admin/inquiries/${inq._id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 transition-colors group"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] font-bold text-blue-400">
                        {inq.referenceNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {inq.customerName}
                      </span>
                      {inq.businessName && (
                        <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                          ({inq.businessName})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" />
                        {inq.phone}
                      </span>
                      <span>•</span>
                      <span>{inq.locationCity || "Harar / Dire Dawa"}</span>
                      <span>•</span>
                      <span className="text-slate-500">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        inq.status === "NEW"
                          ? "bg-blue-500/20 text-blue-300"
                          : inq.status === "IN_PROGRESS"
                          ? "bg-amber-500/20 text-amber-300"
                          : inq.status === "RESOLVED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {inq.status}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Administrative Activity Stream (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Activity Audit Stream
              </h3>
            </div>
            <Link
              href="/admin/activity-logs"
              className="text-xs font-bold text-ariiti-accent hover:text-blue-300 flex items-center gap-1"
            >
              <span>View Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAuditLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No audit logs recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAuditLogs.map((log: any) => (
                <div
                  key={log._id.toString()}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {log.action}
                      </span>
                      <span className="text-[10px] font-mono text-blue-400">
                        {log.entityType}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-snug truncate">
                    {log.summary}
                  </p>
                  <p className="text-[9px] font-mono text-slate-500 mt-1">
                    By: {log.actorEmail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
