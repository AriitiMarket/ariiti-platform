"use client";

import React, { useState } from "react";
import {
  History,
  Search,
  Filter,
  Shield,
  User,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

interface AuditLogItem {
  _id: string;
  actorEmail: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "LOGIN";
  entityType: "SERVICE" | "PRODUCT" | "CASE_STUDY" | "INQUIRY" | "SETTINGS" | "USER";
  entityId: string;
  summary: string;
  createdAt: string;
}

interface ActivityLogsViewerProps {
  logs: AuditLogItem[];
}

export const ActivityLogsViewer: React.FC<ActivityLogsViewerProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [selectedEntity, setSelectedEntity] = useState("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesAction = selectedAction === "ALL" || log.action === selectedAction;
    const matchesEntity = selectedEntity === "ALL" || log.entityType === selectedEntity;
    const matchesSearch =
      log.actorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesEntity && matchesSearch;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "UPDATE":
        return "bg-brand-primary/10 text-brand-primary border-brand-primary/20";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "STATUS_CHANGE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "LOGIN":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by actor email, summary, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          {/* Action Filter */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="STATUS_CHANGE">STATUS_CHANGE</option>
            <option value="LOGIN">LOGIN</option>
          </select>

          {/* Entity Filter */}
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-mono"
          >
            <option value="ALL">All Entities</option>
            <option value="SERVICE">SERVICE</option>
            <option value="PRODUCT">PRODUCT</option>
            <option value="CASE_STUDY">CASE_STUDY</option>
            <option value="INQUIRY">INQUIRY</option>
            <option value="SETTINGS">SETTINGS</option>
            <option value="USER">USER</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-500 self-end md:self-auto font-medium">
          Showing {filteredLogs.length} of {logs.length} audit records
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4 text-center">Action</th>
                <th className="py-3 px-4 text-center">Entity Type</th>
                <th className="py-3 px-4">Audit Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No activity logs match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {log.actorEmail}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-md">
                      <div className="line-clamp-2 leading-relaxed">
                        {log.summary}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                        Target ID: {log.entityId}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsViewer;
