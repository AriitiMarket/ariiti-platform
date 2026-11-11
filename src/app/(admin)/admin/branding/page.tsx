import React from "react";
import { Palette, Copy, Check, Download, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminBrandingPage() {
  const brandColors = [
    {
      name: "Ariiti Primary Navy",
      hex: "#20305C",
      variable: "var(--ariiti-navy)",
      usage: "Primary brand surfaces, header backgrounds, enterprise hero cards",
      textColor: "text-white",
    },
    {
      name: "Onyx Dark",
      hex: "#141414",
      variable: "var(--ariiti-dark)",
      usage: "High contrast headings, terminal card backdrops, footer",
      textColor: "text-white",
    },
    {
      name: "Electric Accent Blue",
      hex: "#2563EB",
      variable: "var(--ariiti-accent)",
      usage: "Call to actions, active pills, links, progress indicators",
      textColor: "text-white",
    },
    {
      name: "Operational Emerald",
      hex: "#10B981",
      variable: "var(--ariiti-success)",
      usage: "Uptime metrics, verified deployment badges, active SLAs",
      textColor: "text-white",
    },
    {
      name: "Neutral Canvas Light",
      hex: "#F8FAFC",
      variable: "bg-slate-50",
      usage: "Public website background, clean article card backgrounds",
      textColor: "text-slate-900",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-5 h-5 text-ariiti-accent" />
          <span className="text-xs font-mono uppercase tracking-wider text-ariiti-accent font-bold">
            Corporate Guidelines
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Brand Identity & Design System Standards
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Official visual guidelines, authorized color tokens, typography stacks, and logo treatment rules for Ariiti Tech.
        </p>
      </div>

      {/* Brand Color Tokens Palette */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
          Official Color Palette
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brandColors.map((color) => (
            <div
              key={color.hex}
              className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60"
            >
              <div
                className="h-20 p-3 flex flex-col justify-end"
                style={{ backgroundColor: color.hex }}
              >
                <span className={`font-mono text-xs font-bold ${color.textColor}`}>
                  {color.hex}
                </span>
              </div>
              <div className="p-3.5 space-y-1">
                <div className="text-xs font-bold text-white">{color.name}</div>
                <div className="text-[10px] font-mono text-blue-400">
                  {color.variable}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug pt-1">
                  {color.usage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo Treatment & Mark */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
          Official Logo Mark & Clearspace
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-ariiti-navy border border-blue-500/40 flex items-center justify-center text-white shadow-xl mb-4">
              <span className="font-black text-3xl text-blue-400">A</span>
            </div>
            <div className="font-black text-lg tracking-tight text-white">
              ARIITI TECH
            </div>
            <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              Software Solutions & Business Technology
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <h3 className="font-bold text-white">Typography Specifications</h3>
            <p className="leading-relaxed">
              <strong className="text-slate-100">Primary Headings:</strong> System Inter / Space Grotesk Bold for clean enterprise authority.
            </p>
            <p className="leading-relaxed">
              <strong className="text-slate-100">Body Typography:</strong> Inter Regular & Medium with 1.6 line height for effortless readability across high-density technical cards.
            </p>
            <p className="leading-relaxed">
              <strong className="text-slate-100">Code & Telemetry:</strong> JetBrains Mono / monospace font for reference IDs, IP addresses, SLA timestamps, and pricing matrices.
            </p>
          </div>
        </div>
      </div>

      {/* Brand Tone of Voice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3 text-xs">
        <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
          Enterprise Voice & Copywriting Standards
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-bold text-blue-400 mb-1">1. Practical & Verifiable</div>
            <p className="text-slate-400 leading-snug">
              Never invent vague statistics or unverified claims. Highlight concrete specs: Cat6 copper, Fluke certified, 0ms local latency.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-bold text-blue-400 mb-1">2. Eastern Ethiopia Rooted</div>
            <p className="text-slate-400 leading-snug">
              Emphasize rapid on-site physical dispatch in Harar and Dire Dawa with real 2-hour field response commitments.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="font-bold text-blue-400 mb-1">3. Mission-Critical Tone</div>
            <p className="text-slate-400 leading-snug">
              Communicate enterprise resilience: offline-first architectures that operate without internet during regional fiber disruptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
