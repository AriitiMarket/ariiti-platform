import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}) => {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider text-ariiti-accent mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ariiti-navy tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base sm:text-lg text-ariiti-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
