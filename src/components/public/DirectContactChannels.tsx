import React from "react";
import { IWebsiteSettings } from "@/models/WebsiteSettings";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink,
  Globe,
} from "lucide-react";

interface DirectContactChannelsProps {
  settings: IWebsiteSettings;
}

export const DirectContactChannels: React.FC<DirectContactChannelsProps> = ({
  settings,
}) => {
  const cleanWhatsAppNumber = (settings.whatsappNumber || "251915000000").replace(
    /[^0-9]/g,
    ""
  );

  return (
    <div className="space-y-6">
      {/* 1. Direct Telephone Dispatch */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-ariiti-accent transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-ariiti-accent flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ariiti-navy">
              Direct Telephone Lines
            </h3>
            <p className="text-xs text-slate-500">
              Immediate voice consultation with an operations specialist
            </p>
          </div>
        </div>
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-xs font-medium text-slate-500">Primary:</span>
            <a
              href={`tel:${settings.primaryPhone}`}
              className="font-bold text-ariiti-navy hover:text-ariiti-accent transition-colors"
            >
              {settings.primaryPhone}
            </a>
          </div>
          {settings.secondaryPhone && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-xs font-medium text-slate-500">
                Operations / On-Call:
              </span>
              <a
                href={`tel:${settings.secondaryPhone}`}
                className="font-bold text-ariiti-navy hover:text-ariiti-accent transition-colors"
              >
                {settings.secondaryPhone}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 2. Direct WhatsApp Business Channel */}
      <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-950">
              WhatsApp Business Quick Chat
            </h3>
            <p className="text-xs text-emerald-800/80">
              Typically replies within 15–30 minutes during business hours
            </p>
          </div>
        </div>
        <p className="text-xs text-emerald-900/90 leading-relaxed mb-4">
          Prefer texting? Send us equipment photos, floor layout sketches, or questions directly on WhatsApp.
        </p>
        <a
          href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
            "Hello Ariiti Tech, I would like to inquire about your business IT solutions and software services."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Open WhatsApp Conversation</span>
        </a>
      </div>

      {/* 3. Official Corporate Email */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ariiti-navy">
              Formal RFPs & Email Inquiries
            </h3>
            <p className="text-xs text-slate-500">
              For structured tenders, formal quotes, and architectural docs
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100">
          <a
            href={`mailto:${settings.businessEmail}`}
            className="text-sm font-semibold text-ariiti-accent hover:underline break-all block"
          >
            {settings.businessEmail}
          </a>
        </div>
      </div>

      {/* 4. Regional Coverage & Office Locations */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-ariiti-navy flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-ariiti-accent" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ariiti-navy">
              Physical Regional Hubs
            </h3>
            <p className="text-xs text-slate-500">
              Rapid on-site dispatch and technical support
            </p>
          </div>
        </div>

        <ul className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
          {(settings.officeLocations || [
            "Harar, Eastern Ethiopia",
            "Dire Dawa, Eastern Ethiopia",
          ]).map((location, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-slate-800">{location}</span>
            </li>
          ))}
          <li className="flex items-center gap-2 text-slate-500 pt-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Remote software deployments supported nationwide</span>
          </li>
        </ul>

        {/* Operating Hours */}
        <div className="border-t border-slate-100 pt-3 flex items-start gap-2.5 text-xs text-slate-600">
          <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800">Operating Hours:</p>
            <p>Monday – Saturday: 8:30 AM – 6:00 PM</p>
            <p className="text-[11px] text-slate-500">
              24/7 emergency dispatch for contracted SLA maintenance clients
            </p>
          </div>
        </div>
      </div>

      {/* 5. Official Community Channels */}
      {settings.socialLinks && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="font-bold text-slate-700 block mb-2 uppercase tracking-wider text-[11px]">
            Official Verified Channels:
          </span>
          <div className="flex flex-wrap gap-2">
            {settings.socialLinks.telegram && (
              <a
                href={settings.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-ariiti-accent hover:border-ariiti-accent font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Telegram Channel</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            {settings.socialLinks.github && (
              <a
                href={settings.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-ariiti-navy hover:border-slate-400 font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>GitHub Org</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            {settings.socialLinks.facebook && (
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Facebook Page</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectContactChannels;
