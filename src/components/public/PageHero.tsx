import React from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  description,
  badge,
  children,
  className,
  align = "left",
}) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-brand-primary text-white border-b border-[#0d3f6d] py-14 sm:py-20",
        className
      )}
    >
      {/* Background Micro-Dot Pattern in White */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:20px_20px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={cn(
            "max-w-3xl",
            align === "center" && "mx-auto text-center"
          )}
        >
          {/* Eyebrow & Optional Status Badge */}
          <div
            className={cn(
              "flex flex-wrap items-center gap-2.5 mb-3",
              align === "center" && "justify-center"
            )}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              {eyebrow}
            </span>
            {badge && <div>{badge}</div>}
          </div>

          {/* Page Headline: Deep navy hero with white heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.18]">
            {title}
          </h1>

          {/* Description: Deep navy hero with white text */}
          <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
            {description}
          </p>

          {/* Optional Action / Filter / Jump Links Container */}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
