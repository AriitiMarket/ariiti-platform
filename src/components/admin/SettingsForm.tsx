"use client";

import React, { useState, useTransition } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Phone,
  Mail,
  MapPin,
  Share2,
  Plus,
  Trash2,
} from "lucide-react";
import {
  updateWebsiteSettings,
  UpdateSettingsInput,
} from "@/actions/admin/settings";

interface SettingsFormProps {
  initialSettings: {
    companyName: string;
    tagline: string;
    primaryPhone: string;
    secondaryPhone?: string;
    whatsappNumber: string;
    businessEmail: string;
    officeLocations: string[];
    socialLinks: {
      telegram?: string;
      linkedin?: string;
      facebook?: string;
      github?: string;
    };
    announcementBanner: {
      isActive: boolean;
      text?: string;
      linkUrl?: string;
    };
  };
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialSettings,
}) => {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState(
    initialSettings.companyName || "Ariiti Tech"
  );
  const [tagline, setTagline] = useState(initialSettings.tagline || "");
  const [primaryPhone, setPrimaryPhone] = useState(
    initialSettings.primaryPhone || ""
  );
  const [secondaryPhone, setSecondaryPhone] = useState(
    initialSettings.secondaryPhone || ""
  );
  const [whatsappNumber, setWhatsappNumber] = useState(
    initialSettings.whatsappNumber || ""
  );
  const [businessEmail, setBusinessEmail] = useState(
    initialSettings.businessEmail || ""
  );
  const [locations, setLocations] = useState<string[]>(
    initialSettings.officeLocations && initialSettings.officeLocations.length > 0
      ? initialSettings.officeLocations
      : ["Harar, Ethiopia", "Dire Dawa, Ethiopia"]
  );

  // Social Links
  const [telegram, setTelegram] = useState(
    initialSettings.socialLinks?.telegram || ""
  );
  const [linkedin, setLinkedin] = useState(
    initialSettings.socialLinks?.linkedin || ""
  );
  const [facebook, setFacebook] = useState(
    initialSettings.socialLinks?.facebook || ""
  );
  const [github, setGithub] = useState(
    initialSettings.socialLinks?.github || ""
  );

  // Announcement Banner
  const [bannerActive, setBannerActive] = useState(
    initialSettings.announcementBanner?.isActive ?? false
  );
  const [bannerText, setBannerText] = useState(
    initialSettings.announcementBanner?.text || ""
  );
  const [bannerLinkUrl, setBannerLinkUrl] = useState(
    initialSettings.announcementBanner?.linkUrl || ""
  );

  const handleLocationChange = (idx: number, val: string) => {
    const updated = [...locations];
    updated[idx] = val;
    setLocations(updated);
  };

  const addLocation = () => {
    setLocations([...locations, ""]);
  };

  const removeLocation = (idx: number) => {
    setLocations(locations.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);

    const payload: UpdateSettingsInput = {
      companyName,
      tagline,
      primaryPhone,
      secondaryPhone: secondaryPhone || undefined,
      whatsappNumber,
      businessEmail,
      officeLocations: locations.filter((loc) => loc.trim().length > 0),
      socialLinks: {
        telegram: telegram.trim(),
        linkedin: linkedin.trim(),
        facebook: facebook.trim(),
        github: github.trim(),
      },
      announcementBanner: {
        isActive: bannerActive,
        text: bannerText.trim(),
        linkUrl: bannerLinkUrl.trim() || undefined,
      },
    };

    startTransition(async () => {
      const res = await updateWebsiteSettings(payload);
      if (!res.success) {
        setError(res.error || "Failed to update website settings.");
      } else {
        setFeedback(
          "Global settings updated successfully! Public marketing pages have been revalidated on-demand."
        );
        setTimeout(() => setFeedback(null), 6000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-16">
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Emergency SLA Announcement Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary font-mono">
              Live Announcement & Emergency SLA Banner
            </h3>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={bannerActive}
              onChange={(e) => setBannerActive(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-xs font-bold text-amber-600 font-mono">
              {bannerActive ? "BANNER ACTIVE (LIVE)" : "BANNER DISABLED"}
            </span>
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Banner Announcement Text
            </label>
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="e.g. ⚡ 2-Hour Guaranteed Emergency On-Site Dispatch active across Harar & Dire Dawa."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Action URL (Optional Link)
            </label>
            <input
              type="text"
              value={bannerLinkUrl}
              onChange={(e) => setBannerLinkUrl(e.target.value)}
              placeholder="/contact or https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* 2. Corporate Contact Details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Phone className="w-4 h-4 text-brand-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary font-mono">
            Direct Commercial Contact & Telephony
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Primary Phone Number *
            </label>
            <input
              type="text"
              required
              value={primaryPhone}
              onChange={(e) => setPrimaryPhone(e.target.value)}
              placeholder="+251915000000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Secondary / Hotline Phone
            </label>
            <input
              type="text"
              value={secondaryPhone}
              onChange={(e) => setSecondaryPhone(e.target.value)}
              placeholder="+251920000000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Direct WhatsApp Number * (No + sign, e.g. 251915000000)
            </label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="251915000000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-emerald-700 font-mono font-bold focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Official Corporate Email *
            </label>
            <input
              type="email"
              required
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              placeholder="contact@ariititech.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* 3. Company Identity & Tagline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary font-mono pb-3 border-b border-slate-100">
          Company Identity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Legal / Brand Name *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Official Corporate Tagline *
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* 4. Physical Office Hubs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary font-mono">
            Regional Office Hubs & Service Desks
          </h3>
        </div>

        <div className="space-y-2">
          {locations.map((loc, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={loc}
                onChange={(e) => handleLocationChange(idx, e.target.value)}
                placeholder="e.g. Harar Hub: Kebele 14, Commercial District, Harar, Ethiopia"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
              {locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(idx)}
                  className="p-2 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLocation}
          className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Another Office Location</span>
        </button>
      </div>

      {/* 5. Official Social Links */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Share2 className="w-4 h-4 text-brand-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary font-mono">
            Social Media & Communication Channels
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Telegram Channel URL
            </label>
            <input
              type="url"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="https://t.me/aritiiteck"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              Facebook Page URL
            </label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              LinkedIn Organization URL
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/company/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-1">
              GitHub Organization URL
            </label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/AriitiTech"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover active:bg-[#061e35] text-white text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Global Configuration...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Revalidate Public Platform</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;
