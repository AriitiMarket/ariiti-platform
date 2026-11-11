"use client";

import React, { useState } from "react";
import {
  Wifi,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Zap,
  Activity,
  Server,
} from "lucide-react";
import Link from "next/link";

type TabKey = "pos" | "networking" | "sla";

interface TabConfig {
  id: TabKey;
  label: string;
  badge: string;
  title: string;
  metrics: { label: string; value: string; unit?: string }[];
  specs: string[];
  ctaUrl: string;
  ctaText: string;
}

const TABS: TabConfig[] = [
  {
    id: "pos",
    label: "Offline-First POS",
    badge: "0-Second Downtime Architecture",
    title: "Continuous Local Checkout with Auto Cloud-Sync",
    metrics: [
      { label: "Checkout Latency", value: "0", unit: "ms" },
      { label: "Print Speed", value: "<1.2", unit: "s" },
      { label: "Offline Resilience", value: "100", unit: "%" },
    ],
    specs: [
      "IndexedDB local ledger rings sales when Ethio Telecom fiber drops",
      "Direct hardware ESC/POS driver integration for 80mm thermal printers",
      "Cryptographic deduplication on automated cloud reconnection",
      "Granular cashier shift reconciliation & RJ11 cash drawer lock",
    ],
    ctaUrl: "/products",
    ctaText: "Explore Ariiti POS",
  },
  {
    id: "networking",
    label: "Commercial LAN & Wi-Fi",
    badge: "Dual-WAN Failover Ready",
    title: "Certified Cat6 Cabling & High-Density MikroTik/UniFi",
    metrics: [
      { label: "Failover Speed", value: "1.5", unit: "s" },
      { label: "Concurrent AP Load", value: "150+", unit: "dev" },
      { label: "VLAN Separation", value: "4", unit: "nets" },
    ],
    specs: [
      "Solid Cat6 copper drops dressed in 12U/24U server rack with patch panels",
      "MikroTik CCR core router with hardware-accelerated traffic priority",
      "Ceiling-mount enterprise APs with seamless fast-roaming (802.11k/v/r)",
      "Strict VLAN isolation for POS terminals, management, and guest Wi-Fi",
    ],
    ctaUrl: "/services/networking-it-infrastructure",
    ctaText: "View Networking Scope",
  },
  {
    id: "sla",
    label: "Emergency SLA Support",
    badge: "Eastern Ethiopia Rapid Dispatch",
    title: "Proactive Preventive Care & 2-Hour On-Site SLA",
    metrics: [
      { label: "Emergency SLA", value: "<2", unit: "hrs" },
      { label: "Backup Redundancy", value: "24", unit: "hrs" },
      { label: "Regional Hubs", value: "2", unit: "cities" },
    ],
    specs: [
      "Guaranteed on-site technician dispatch in Harar & Dire Dawa",
      "Automated daily mirrored database backups (local NAS + encrypted cloud)",
      "Monthly thermal paste reapplication & high-pressure compressor dusting",
      "Quarterly IT health scorecards and preemptive hardware replacement",
    ],
    ctaUrl: "/services/it-maintenance-support",
    ctaText: "View Support Agreements",
  },
];

export const HeroInteractivePreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("pos");

  const current = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden text-left">
      {/* Top Interactive Tabs Bar */}
      <div className="flex border-b border-slate-800/80 bg-slate-950/60 p-1.5 gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 ${
                isActive
                  ? "bg-ariiti-navy text-white shadow-md border border-slate-700/80"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {tab.id === "pos" && <HardDrive className="w-3.5 h-3.5 text-blue-400" />}
              {tab.id === "networking" && <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              {tab.id === "sla" && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Preview Screen */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Header with Live Status Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE PREVIEW</span>
            </span>
            <span className="text-xs text-slate-400 font-mono tracking-wide">
              {current.badge}
            </span>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            ENGINEERED FOR HARAR & DIRE DAWA
          </span>
        </div>

        {/* Feature Title */}
        <h4 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-snug">
          {current.title}
        </h4>

        {/* Metric Badges Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {current.metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-2.5 sm:p-3 text-center"
            >
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  {m.value}
                </span>
                {m.unit && (
                  <span className="text-xs text-ariiti-accent font-bold font-mono">
                    {m.unit}
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Architectural Specs List */}
        <div className="space-y-2 bg-slate-950/40 border border-slate-800/60 rounded-xl p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-ariiti-accent" />
            <span>Architecture & Operational Specs</span>
          </p>
          <ul className="space-y-1.5">
            {current.specs.map((spec, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-300 leading-snug"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Link Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Standardized Regional Deployment</span>
          </div>

          <Link
            href={current.ctaUrl}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ariiti-accent hover:text-blue-300 transition-colors"
          >
            <span>{current.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroInteractivePreview;
