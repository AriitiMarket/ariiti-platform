import React from "react";
import connectDB from "@/lib/mongodb";
import WebsiteSettings from "@/models/WebsiteSettings";
import { Building2, Phone, Mail, MapPin, Globe, Edit3 } from "lucide-react";
import Link from "next/link";
import AriitiLogo from "@/components/ui/AriitiLogo";

export const dynamic = "force-dynamic";

export default async function AdminCompanyProfilePage() {
  await connectDB();
  const rawSettings = await WebsiteSettings.findOne().lean();

  const settings = {
    companyName: rawSettings?.companyName || "Ariiti Tech",
    tagline: rawSettings?.tagline || "Technology Solutions That Help Your Business Grow.",
    primaryPhone: rawSettings?.primaryPhone || "+251 90 000 0000",
    secondaryPhone: rawSettings?.secondaryPhone || "+251 91 111 1111",
    whatsappNumber: rawSettings?.whatsappNumber || "+251 90 000 0000",
    businessEmail: rawSettings?.businessEmail || "contact@ariititech.com",
    officeLocations: rawSettings?.officeLocations?.length
      ? rawSettings.officeLocations
      : ["Harar Commercial Center, Ethiopia", "Dire Dawa Business Hub, Ethiopia"],
    socialLinks: {
      telegram: rawSettings?.socialLinks?.telegram || "https://t.me/aritiiteck",
      facebook: rawSettings?.socialLinks?.facebook || "https://www.facebook.com/profile.php?id=61596506150647",
      github: rawSettings?.socialLinks?.github || "https://github.com/AriitiTech",
    },
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-brand-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
              Organization Identity
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
            Organization Profile &amp; Enterprise Dossier
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Official corporate profile, mission, regional headquarters, and communication channels.
          </p>
        </div>

        {/* Primary Action Button: Deep navy blue with white text */}
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Company Information</span>
        </Link>
      </div>

      {/* Main Profile Dossier Card: White background with subtle borders and shadows */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-900">
        <div className="flex items-start justify-between border-b border-slate-100 pb-5">
          <AriitiLogo
            variant="dark"
            size="lg"
            subtitle={settings.tagline}
          />
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
            VERIFIED ENTERPRISE
          </span>
        </div>

        {/* Narrative & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-primary block font-bold mb-1">
              Corporate Mission
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              Delivering high-reliability software, offline-first commerce systems, and certified networking infrastructure tailored specifically to Eastern Ethiopia&apos;s physical constraints.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-primary block font-bold mb-1">
              Strategic Vision
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              To be Eastern Ethiopia&apos;s foremost technology infrastructure partner, bridging the digital resilience divide for supermarkets, healthcare, and financial enterprises.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-primary block font-bold mb-1">
              Core Principles
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              Zero Downtime Tolerance, Offline Resilience by Design, 2-Hour Regional SLA Guarantee, and Verifiable Hardware-Grade Deployments.
            </p>
          </div>
        </div>

        {/* Operational Dispatch Hubs & Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-primary font-bold block">
              Official Contact Channels
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-brand-primary" />
                <span className="font-mono">{settings.primaryPhone}</span>
                {settings.secondaryPhone && (
                  <span className="text-slate-500 font-mono">/ {settings.secondaryPhone}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-brand-primary" />
                <span className="font-mono">{settings.businessEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Globe className="w-3.5 h-3.5 text-brand-primary" />
                <span className="font-mono">https://ariititech.com</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-primary font-bold block">
              Regional Operations Hubs
            </span>
            <div className="space-y-2 text-xs text-slate-700">
              {settings.officeLocations.map((loc: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  <span>{loc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
