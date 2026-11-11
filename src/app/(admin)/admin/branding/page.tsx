import React from "react";
import { Palette, ShieldCheck, Sparkles, Check } from "lucide-react";
import AriitiLogo, { AriitiLogoMark } from "@/components/ui/AriitiLogo";

export const dynamic = "force-dynamic";

export default function AdminBrandingPage() {
  const brandColors = [
    {
      name: "Primary Brand Color — Deep Navy Blue",
      hex: "#093053",
      rgb: "rgb(9, 48, 83)",
      hsl: "hsl(208, 80%, 18%)",
      variable: "var(--brand-primary)",
      usage: "Primary brand identity, public header & hero, footer, admin sidebar, primary buttons, section headings",
      bgClass: "bg-brand-primary",
      textColor: "text-white",
      badgeColor: "bg-white/20 text-white",
    },
    {
      name: "Secondary Brand Color — White",
      hex: "#FFFFFF",
      rgb: "rgb(255, 255, 255)",
      hsl: "hsl(0, 0%, 100%)",
      variable: "var(--brand-secondary)",
      usage: "Main page backgrounds, cards, form input backgrounds, active sidebar indicators, navigation text on navy",
      bgClass: "bg-white border border-slate-200",
      textColor: "text-brand-primary",
      badgeColor: "bg-brand-primary/10 text-brand-primary",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-5 h-5 text-brand-primary" />
          <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
            Official Corporate Guidelines
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
          Brand Identity &amp; UI Design Requirements
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Official visual guidelines, authorized color tokens, typography stacks, and logo treatment rules for Ariiti Tech.
        </p>
      </div>

      {/* Official Color Tokens Palette */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-brand-primary tracking-tight uppercase font-mono">
          Official Brand Colors (Exclusive Palette)
        </h2>
        <p className="text-xs text-slate-600">
          Only these two official primary brand colors are authorized throughout the Ariiti Tech public website and admin dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandColors.map((color) => (
            <div
              key={color.hex}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <div
                className={`h-28 p-4 flex flex-col justify-end ${color.bgClass}`}
              >
                <span className={`font-mono text-sm font-bold ${color.textColor}`}>
                  {color.hex}
                </span>
                <span className={`font-mono text-xs opacity-90 ${color.textColor}`}>
                  {color.rgb} • {color.hsl}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <div className="text-sm font-bold text-brand-primary">
                  {color.name}
                </div>
                <div className="text-xs font-mono text-slate-600">
                  CSS Variable: <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-brand-primary">{color.variable}</code>
                </div>
                <p className="text-xs text-slate-600 leading-snug pt-1">
                  {color.usage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Logo Treatment & Specifications */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-brand-primary tracking-tight uppercase font-mono">
          Official Logo Treatment &amp; Consistency
        </h2>
        <p className="text-xs text-slate-600">
          Both the Public Website and Admin Dashboard share the identical official Ariiti Tech logo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dark Background Variant */}
          <div className="bg-brand-primary border border-[#0d3f6d] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-4 font-bold">
              Variant: On Dark Navy Background
            </span>
            <AriitiLogo
              variant="light"
              size="lg"
              subtitle="Software Solutions & Business Technology"
            />
            <p className="text-xs text-white/75 mt-4 max-w-xs">
              Used in public Header, Footer, Hero sections, and Admin Sidebar.
            </p>
          </div>

          {/* Light Background Variant */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4 font-bold">
              Variant: On Light White Background
            </span>
            <AriitiLogo
              variant="dark"
              size="lg"
              subtitle="Software Solutions & Business Technology"
            />
            <p className="text-xs text-slate-600 mt-4 max-w-xs">
              Used in Admin Topbar, official stationery, and light cards.
            </p>
          </div>
        </div>
      </div>

      {/* Public Website vs Admin Dashboard Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-brand-primary uppercase font-mono">
            Public Website Design System
          </h3>
          <ul className="text-xs text-slate-700 space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Header:</strong> Deep navy blue (#093053) with white navigation text.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Hero section:</strong> Deep navy blue with white headings and text.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Primary buttons:</strong> Deep navy blue background with white text.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Secondary buttons:</strong> White background with deep navy blue text and border.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Main page background:</strong> Clean White (#FFFFFF).</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Section headings:</strong> Deep navy blue (#093053).</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Footer:</strong> Deep navy blue with white text.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-brand-primary uppercase font-mono">
            Admin Dashboard Design System
          </h3>
          <ul className="text-xs text-slate-700 space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Sidebar:</strong> Deep navy blue (#093053) with white text &amp; icons.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Active sidebar item:</strong> White background with deep navy blue text and icon.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Header:</strong> White background with deep navy blue text and icons.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Main content background:</strong> White or light neutral.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Page headings:</strong> Deep navy blue (#093053).</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Input fields:</strong> White backgrounds with clear neutral borders.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span><strong>Tables:</strong> White backgrounds, readable text and subtle separators.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
