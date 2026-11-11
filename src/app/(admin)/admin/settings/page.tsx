import React from "react";
import connectDB from "@/lib/mongodb";
import WebsiteSettings from "@/models/WebsiteSettings";
import SettingsForm from "@/components/admin/SettingsForm";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await connectDB();
  const rawSettings = await WebsiteSettings.findOne().lean();

  const settings = {
    companyName: rawSettings?.companyName || "Ariiti Tech",
    tagline: rawSettings?.tagline || "Technology Solutions That Help Your Business Grow.",
    primaryPhone: rawSettings?.primaryPhone || "+251915000000",
    secondaryPhone: rawSettings?.secondaryPhone || "+251920000000",
    whatsappNumber: rawSettings?.whatsappNumber || "251915000000",
    businessEmail: rawSettings?.businessEmail || "contact@ariititech.com",
    officeLocations: rawSettings?.officeLocations || [
      "Harar Hub: Kebele 14, Commercial District, Harar, Ethiopia",
      "Dire Dawa Center: Kezira Commercial Corridor, Dire Dawa, Ethiopia",
    ],
    socialLinks: {
      telegram: rawSettings?.socialLinks?.telegram || "https://t.me/aritiiteck",
      linkedin: rawSettings?.socialLinks?.linkedin || "https://linkedin.com/company/ariiti-tech",
      facebook: rawSettings?.socialLinks?.facebook || "https://www.facebook.com/profile.php?id=61596506150647",
      github: rawSettings?.socialLinks?.github || "https://github.com/AriitiTech",
    },
    announcementBanner: {
      isActive: rawSettings?.announcementBanner?.isActive ?? true,
      text: rawSettings?.announcementBanner?.text || "",
      linkUrl: rawSettings?.announcementBanner?.linkUrl || "/contact",
    },
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-4 h-4 text-brand-primary" />
          <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
            Super Admin Restricted
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
          Global Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage corporate contact endpoints, emergency SLA announcement banners, office locations, and communication channels.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
