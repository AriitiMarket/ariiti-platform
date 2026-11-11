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
        "relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-ariiti-light border-b border-slate-200/80 py-14 sm:py-20",
        className
      )}
    >
      {/* Background Micro-Dot Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#20305C_1px,transparent_1px)] [background-size:20px_20px]"
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
            <span className="text-xs font-black uppercase tracking-widest text-ariiti-accent">
              {eyebrow}
            </span>
            {badge && <div>{badge}</div>}
          </div>

          {/* Page Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ariiti-navy tracking-tight leading-[1.18]">
            {title}
          </h1>

          {/* Description */}
          <p className="mt-4 text-base sm:text-lg text-ariiti-muted leading-relaxed">
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
