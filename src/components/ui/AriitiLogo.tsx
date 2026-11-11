import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AriitiLogoProps {
  /**
   * "light" = white logo / white text for dark backgrounds (e.g. Navy footer, hero card)
   * "dark" = deep navy mark / deep navy text for light backgrounds (e.g. Header, white cards)
   */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  showSubtitle?: boolean;
  href?: string;
  className?: string;
}

export const AriitiLogoMark: React.FC<{
  variant?: "light" | "dark";
  className?: string;
  size?: "sm" | "md" | "lg";
}> = ({ variant = "dark", className, size = "md" }) => {
  const sizeClasses = {
    sm: "w-7 h-7 rounded-lg",
    md: "w-9 h-9 sm:w-10 sm:h-10 rounded-xl",
    lg: "w-12 h-12 rounded-2xl",
  };

  const isLight = variant === "light";

  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0 overflow-hidden select-none transition-transform shadow-sm",
        sizeClasses[size],
        isLight
          ? "bg-[#093053] border border-white/20"
          : "bg-[#093053] border border-slate-200/80",
        className
      )}
      aria-hidden="true"
    >
      <Image
        src="/ariiti-logo.svg"
        alt="Ariiti Tech"
        width={48}
        height={48}
        className="w-full h-full object-cover"
        priority
        unoptimized
      />
    </div>
  );
};

export const AriitiLogo: React.FC<AriitiLogoProps> = ({
  variant = "dark",
  size = "md",
  subtitle,
  showSubtitle = false,
  href,
  className,
}) => {
  const isLight = variant === "light";

  const titleSizes = {
    sm: "text-sm sm:text-base tracking-tight",
    md: "text-lg sm:text-xl tracking-tight",
    lg: "text-xl sm:text-2xl tracking-tight",
  };

  const subtitleSizes = {
    sm: "text-[8.5px] tracking-wider",
    md: "text-[9.5px] tracking-widest",
    lg: "text-[11px] tracking-widest",
  };

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 sm:gap-3 group", className)}>
      <AriitiLogoMark variant={variant} size={size} />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-black leading-none font-sans transition-colors",
            titleSizes[size],
            isLight
              ? "text-white"
              : "text-[#093053] group-hover:text-[#07243e]"
          )}
        >
          Ariiti Tech
        </span>
        {showSubtitle && (
          <span
            className={cn(
              "uppercase font-bold -mt-0.5 leading-tight font-mono",
              subtitleSizes[size],
              isLight ? "text-white/75" : "text-slate-500"
            )}
          >
            {subtitle || "Technologies"}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#093053] focus-visible:ring-offset-2 rounded-lg inline-flex py-1"
        aria-label="Ariiti Tech Homepage"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default AriitiLogo;
