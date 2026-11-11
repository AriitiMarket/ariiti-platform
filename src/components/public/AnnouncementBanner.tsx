import React from "react";
import Link from "next/link";
import { IAnnouncementBanner } from "@/models/WebsiteSettings";
import { ArrowRight, Zap } from "lucide-react";

interface AnnouncementBannerProps {
  banner?: IAnnouncementBanner;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  banner,
}) => {
  if (!banner || !banner.isActive || !banner.text) {
    return null;
  }

  const content = (
    <div className="bg-gradient-to-r from-slate-950 via-ariiti-navy to-slate-950 text-slate-200 text-[11px] py-1 px-3 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center flex-wrap">
        <Zap className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />
        <span className="font-semibold text-slate-100">{banner.text}</span>
        {banner.linkUrl && (
          <span className="inline-flex items-center gap-0.5 font-bold text-blue-400 underline ml-1 hover:text-white transition-colors">
            <span>Learn more</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </span>
        )}
      </div>
    </div>
  );

  if (banner.linkUrl) {
    const isExternal = banner.linkUrl.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={banner.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={banner.linkUrl} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default AnnouncementBanner;
